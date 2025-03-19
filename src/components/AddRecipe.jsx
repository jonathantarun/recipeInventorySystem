import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase-config'

function AddRecipe() {
  const [name, setName] = useState('')
  const [ingredients, setIngredients] = useState('') // Format: "Bread:2, Eggs:2"
  const [cuisine, setCuisine] = useState('')
  const [cookingTime, setCookingTime] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Parse the ingredients string into an array of objects
    const ingredientsArray = ingredients.split(',').map((item) => {
      const [ingName, qty] = item.split(':').map(str => str.trim())
      return { name: ingName, quantity: Number(qty) }
    })
    try {
      await addDoc(collection(db, 'recipes'), {
        name,
        ingredients: ingredientsArray,
        cuisine,
        cookingTime: cookingTime ? Number(cookingTime) : null,
      })
      setName('')
      setIngredients('')
      setCuisine('')
      setCookingTime('')
      console.log('Recipe added successfully')
    } catch (error) {
      console.error('Error adding recipe:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Recipe</h2>
      <input
        type="text"
        placeholder="Recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Ingredients (format: Bread:2, Eggs:2)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Cooking Time (minutes)"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
      />
      <button type="submit">Add Recipe</button>
    </form>
  )
}

export default AddRecipe
