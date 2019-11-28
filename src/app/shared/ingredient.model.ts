export class Ingredient {
    // This is Typescript shortcut where, you don't need to declare the properties.
    // Just specify the access modifiers i.e 'public' in this case and TS will declare the properties behind the scene.
    constructor (public name: string, public amount: number) {}
}