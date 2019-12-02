import { EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
    updatedIngredients = new EventEmitter<Ingredient[]>();
    ingredients: Ingredient[] = [
        new Ingredient('Apples', 10),
        new Ingredient('Tomatoes', 10)
    ];

    getIngredients() {
        // slice() return the new copy of an array
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.updatedIngredients.emit(this.ingredients.slice());
    }
}