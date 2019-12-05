import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
    updatedIngredients = new Subject<Ingredient[]>();
    ingredients: Ingredient[] = [
        new Ingredient('Apples', 10),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        // slice() return the new copy of an array
        return this.ingredients.slice();
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients = this.ingredients.concat(ingredients);
        this.updatedIngredients.next(this.ingredients.slice());
    }
}