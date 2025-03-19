import React, { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
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

    // Normalize the name (optional: store in lowercase to avoid duplicates like "Eggs" vs "eggs")
    const normalizedName = name.trim()

    try {
      // Check if the ingredient already exists
      const qCheck = query(
        collection(db, 'pantry'),
        where('name', '==', normalizedName)
      )
      const querySnapshot = await getDocs(qCheck)

      if (!querySnapshot.empty) {
        // Ingredient exists, update the existing document
        const existingDoc = querySnapshot.docs[0]
        const existingData = existingDoc.data()
        const newQuantity = (existingData.quantity || 0) + quantity

        await updateDoc(doc(db, 'pantry', existingDoc.id), {
          quantity: newQuantity,
        })
      } else {
        // Ingredient does not exist, create a new document
        await addDoc(collection(db, 'pantry'), {
          name: normalizedName,
          quantity,
        })
      }

      // Reset the form
      setName('')
      setQuantity(1)
    } catch (error) {
      console.error('Error adding/updating ingredient:', error)
    }
  }

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
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PantryManager
