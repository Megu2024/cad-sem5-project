import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality.toLowerCase() === speciality.toLowerCase()))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ]

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialities.map((item, index) => (
            <p
              key={index}
              onClick={() =>
                speciality?.toLowerCase() === item.toLowerCase()
                  ? navigate('/doctors')
                  : navigate(`/doctors/${item}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality?.toLowerCase() === item.toLowerCase() ? 'bg-indigo-100 text-black font-medium' : ''
              }`}
            >
              {item}
            </p>
          ))}
        </div>

        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`)
                window.scrollTo(0, 0)
              }}
              className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img className='bg-blue-50 w-full' src={item.image} alt={item.name} />
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm text-center ${item.available !== false ? 'text-green-500' : 'text-gray-500'}`}>
                  <p className={`w-2 h-2 ${item.available !== false ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                  <p>{item.available !== false ? 'Available' : 'Not Available'}</p>
                </div>
                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                <p className='text-gray-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Doctors
