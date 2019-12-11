import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {}
    
    saveRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://my-ng8-recipe-book.firebaseio.com/recipes.json', recipes)
            .subscribe((response) => {
                console.log(response);
            });
    }

    fetchRecipes() {
        this.http.get<Recipe[]>('https://my-ng8-recipe-book.firebaseio.com/recipes.json')
            .pipe(map((recipes) => {
                return recipes.map((recipe) => {
                    return { ...recipe, ingredients: recipe.ingredients || [] };
                })
            }))
            .subscribe((recipes) => {
                this.recipeService.setRecipes(recipes);
            });
    }
}
