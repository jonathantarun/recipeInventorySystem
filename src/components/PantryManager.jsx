import React, { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase-config'

function PantryManager() {
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [ingredients, setIngredients] = useState([])

  // Real-time listener to fetch pantry items
  useEffect(() => {
    const q = query(collection(db, 'pantry'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setIngredients(items)
    })

    return () => unsubscribe()
  }, [])

  // Add or update ingredient in Firestore
  const addIngredient = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    // Normalize the name: trim spaces and convert to lowercase
    const normalizedName = name.trim().toLowerCase()

    try {
      // Check if ingredient already exists in Firestore
      const qCheck = query(
        collection(db, 'pantry'),
        where('name', '==', name)
      )
      const querySnapshot = await getDocs(qCheck)

      if (!querySnapshot.empty) {
        // Ingredient exists: update its quantity
        const existingDoc = querySnapshot.docs[0]
        const existingData = existingDoc.data()
        const newQuantity = (existingData.quantity || 0) + quantity

        await updateDoc(doc(db, 'pantry', existingDoc.id), {
          quantity: newQuantity,
        })
        console.log(`Updated "${normalizedName}" to quantity ${newQuantity}`)
      } else {
        // Ingredient does not exist: add a new document
        await addDoc(collection(db, 'pantry'), {
          name: name,
          quantity,
        })
        console.log(`Added new ingredient: "${normalizedName}"`)
      }

      // Reset input fields
      setName('')
      setQuantity(1)
    } catch (error) {
      console.error('Error adding/updating ingredient:', error)
    }
  }

  // Delete an ingredient from Firestore
  const deleteIngredient = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantry', id))
      console.log(`Deleted ingredient with id: ${id}`)
    } catch (error) {
      console.error('Error deleting ingredient:', error)
    }
  }

  // Calculate total quantity using reduce (FP example)
  const totalQuantity = ingredients.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <div>
      <h2>Pantry Manager</h2>
      <form onSubmit={addIngredient}>
        <input
          type="text"
          placeholder="Ingredient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <button type="submit">Add Ingredient</button>
      </form>
      <h3>Pantry Items</h3>
      <ul>
        {ingredients.map((item) => (
          <li key={item.id}>
            {item.name} - {item.quantity}{' '}
            <button onClick={() => deleteIngredient(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>Total Quantity: {totalQuantity}</h3>
    </div>
  )
}

export default PantryManager
