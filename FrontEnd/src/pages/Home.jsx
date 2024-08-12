import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <Link to="/users" className="text-white hover:text-gray-300">
  Discover Users
</Link>
    </div>
  )
}
