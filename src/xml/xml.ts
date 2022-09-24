import { parseString } from 'xml2js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseXml = async (xml: string): Promise<any> =>
    await new Promise((resolve, reject) =>
        parseString(
            xml,
            (err, result) => err ? reject(err) : resolve(result)
        )
    )

export const toplLevelXmlElementName = async (xml: string): Promise<string> => {
    const parsed = await parseXml(xml)
    return Object.keys(parsed).pop() as string
}
