import { singleton } from '../../src/server/di/singleton'

class Foo {
    public val = 0
}

class Bar {
    constructor(public foo: Foo) {}
}

class TestDI {
    public dummy = 0

    public foo = () => new Foo()

    public bar = () => new Bar(this.foo())
}

describe('Singleton', () => {
    it('makes all instances created by DI singleton', () => {
        const di = new TestDI()
        singleton(di)
        const foo = di.foo()
        const bar = di.bar()
        foo.val = 1
        expect(bar.foo.val).toBe(1)
        expect(di.dummy).toBe(0)
    })
})
