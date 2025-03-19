import React, { useState, useEffect } from 'react'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config'

function RecipeSuggestions() {
  const [recipes, setRecipes] = useState([])
  const [pantryItems, setPantryItems] = useState([])

  // Retrieve pantry items from Firestore (with full data)
  useEffect(() => {
    const qPantry = query(collection(db, 'pantry'))
    const unsubscribePantry = onSnapshot(qPantry, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: docSnap.data().name.toLowerCase().trim(),
        quantity: docSnap.data().quantity
      }))
      console.log('Pantry items:', items)
      setPantryItems(items)
    })
    return () => unsubscribePantry()
  }, [])

  // Retrieve recipes from Firestore
  useEffect(() => {
    const qRecipes = query(collection(db, 'recipes'))
    const unsubscribeRecipes = onSnapshot(qRecipes, (snapshot) => {
      const recs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      console.log('Fetched recipes:', recs)
      setRecipes(recs)
    })
    return () => unsubscribeRecipes()
  }, [])

  // Helper function to normalize names
  function normalizeName(name) {
    return name.toLowerCase().trim()
  }

  // Filter recipes: each required ingredient must be available in sufficient quantity
  const suggestedRecipes = recipes.filter((recipe) => {
    if (!Array.isArray(recipe.ingredients)) return false
    return recipe.ingredients.every((reqIng) => {
      const normalizedReqName = normalizeName(reqIng.name)
      const pantryItem = pantryItems.find(item => item.name === normalizedReqName)
      return pantryItem && pantryItem.quantity >= reqIng.quantity
    })
  })

  // Function to "make" a recipe by consuming the required quantities from the pantry
  const makeRecipe = async (recipe) => {
    for (const reqIng of recipe.ingredients) {
      const normalizedReqName = normalizeName(reqIng.name)
      const pantryItem = pantryItems.find(item => item.name === normalizedReqName)
      if (pantryItem) {
        const newQuantity = pantryItem.quantity - reqIng.quantity
        try {
          await updateDoc(doc(db, 'pantry', pantryItem.id), { 
            quantity: newQuantity < 0 ? 0 : newQuantity 
          })
          console.log(`Updated ${normalizedReqName} to ${newQuantity < 0 ? 0 : newQuantity}`)
        } catch (error) {
          console.error(`Error updating ${normalizedReqName}:`, error)
        }
      }
    }
  }

  return (
    <div>
      <h2>Recipe Suggestions</h2>
      {suggestedRecipes.length > 0 ? (
        <ul>
          {suggestedRecipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: '1rem' }}>
              <strong>{recipe.name}</strong>
              <br />
              <em>Required Ingredients:</em>
              <ul>
                {recipe.ingredients.map((ing, index) => (
                  <li key={index}>
                    {ing.name} - {ing.quantity}
                  </li>
                ))}
              </ul>
              <button onClick={() => makeRecipe(recipe)}>Make Recipe</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes available with current pantry items.</p>
      )}
    </div>
  )
}

export default RecipeSuggestions
