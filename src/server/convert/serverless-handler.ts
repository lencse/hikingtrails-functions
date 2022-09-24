import { Request, Response } from 'express'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { createDI } from '../di/dependency-injection'
import { config } from '../config/config'
import { pointsAndPlacesFromGpx } from '../../xml/gpx'
import { toplLevelXmlElementName } from '../../xml/xml'

const ajv = new Ajv()
addFormats(ajv)
// const validate = ajv.compile({
//     type: 'object',
//     properties: {
//         fileContent: { type: 'string', format: 'byte' },
//         fileUri: { type: 'string', format: 'uri' }
//     },
//     additionalProperties: false
// })

const di = createDI(config)

export type ConvertRequestParams = {
    fileUri: string | undefined
    fileContent: string | undefined
}

export type ConvertQueryParams = {
    source: 'file' | 'uri' | 'path'
}

export class ApplicationError extends Error {
    public httpStatusCode() {
        return 500
    }
}

export class BadRequestError extends ApplicationError {
    public override httpStatusCode() {
        return 400
    }
}

export class InputError extends ApplicationError {
    public override httpStatusCode() {
        return 422
    }
}

export const handler = async (req: Request, res: Response) => {
    // if (!validate(body)) {
    //     res.status(400)
    //     res.header('Content-Type', 'application/json; charset=UTF-8')
    //     res.send({
    //         msg: 'JSON validation error',
    //         errors: validate.errors
    //     })
    //     return
    // }
    try {
        if (req.method !== 'POST') {
            res.status(405)
            res.header('Content-Type', 'text/plain; charset=UTF-8')
            res.send('405 Method Not Allowed')
            return
        }
        const query = req.query as ConvertQueryParams
        const body = req.body as ConvertRequestParams

        let fileContent = ''
        if (query.source === 'file') {
            if (body.fileContent === undefined) {
                throw new BadRequestError('\'fileContent\' parameter must be set.')
            }
            fileContent = Buffer.from(body.fileContent, 'base64').toString('utf-8')
        }
        if (query.source === 'uri') {
            if (body.fileUri === undefined) {
                throw new BadRequestError('\'fileUri\' parameter must be set.')
            }
            fileContent = await di.httpClient().get(body.fileUri)
        }
        const fileType = await toplLevelXmlElementName(fileContent)
        if (fileType !== 'gpx') {
            throw new InputError('Unsupported file type')
        }
        const trail = await pointsAndPlacesFromGpx(fileContent)
        const path = di.pathGenerator().generatePath(trail)
        if (req.accepts('application/json')) {
            const response = {
                path
            }
            res.status(200)
            res.header('Content-Type', 'application/json; charset=UTF-8')
            res.send(response)
            return
        }
        throw new BadRequestError(
            '\'Accept\' HTTP header must be one of [\'application/json\']'
        )
    } catch (err) {
        if (err instanceof ApplicationError) {
            res.status(err.httpStatusCode())
            res.header('Content-Type', 'application/json; charset=UTF-8')
            res.send({
                msg: err.message
            })
            return
        }
        res.status(500)
        res.header('Content-Type', 'application/json; charset=UTF-8')
        res.send({
            msg: 'Internal server error :('
        })
        console.error(err)
    }
}
