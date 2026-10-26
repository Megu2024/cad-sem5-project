import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, updateDoctor, deleteDoctor } = useContext(AdminContext)
  const { getDoctorsData, currency } = useContext(AppContext)

  // Edit Modal State
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [name, setName] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [available, setAvailable] = useState(true)
  const [password, setPassword] = useState('')
  const [newImage, setNewImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  // Open modal and prefill data
  const handleEditClick = (doc) => {
    setEditingDoctor(doc)
    setName(doc.name || '')
    setSpeciality(doc.speciality || 'General physician')
    setDegree(doc.degree || '')
    setExperience(doc.experience || '1 Year')
    setFees(doc.fees || '')
    setAbout(doc.about || '')
    setAvailable(doc.available !== false)
    setPassword('')
    setNewImage(false)

    if (doc.address) {
      const addr = typeof doc.address === 'string' ? JSON.parse(doc.address) : doc.address
      setAddress1(addr.line1 || '')
      setAddress2(addr.line2 || '')
    } else {
      setAddress1('')
      setAddress2('')
    }
  }

  // Close modal
  const handleCloseModal = () => {
    setEditingDoctor(null)
    setNewImage(false)
    setPassword('')
  }

  // Submit edit form
  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!editingDoctor) return

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('docId', editingDoctor._id)
      formData.append('name', name)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('available', available)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      if (password && password.trim().length > 0) {
        if (password.trim().length < 8) {
          toast.error('Password must be at least 8 characters')
          setIsSubmitting(false)
          return
        }
        formData.append('password', password)
      }

      if (newImage) {
        formData.append('image', newImage)
      }

      const success = await updateDoctor(formData)
      if (success) {
        getDoctorsData()
        handleCloseModal()
      }
    } catch (err) {
      console.log(err)
      toast.error('Failed to update doctor')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle doctor deletion
  const handleDelete = async (docId, docName) => {
    if (window.confirm(`Are you sure you want to delete ${docName}? This action cannot be undone.`)) {
      const success = await deleteDoctor(docId)
      if (success) {
        getDoctorsData()
        if (editingDoctor && editingDoctor._id === docId) {
          handleCloseModal()
        }
      }
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll pb-10'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h1 className='text-xl font-bold text-gray-800'>All Doctors</h1>
          <p className='text-xs text-gray-500 mt-0.5'>Manage, edit doctor details, fees, availability, or remove doctors</p>
        </div>
        <p className='text-sm bg-indigo-50 text-primary font-medium px-4 py-1.5 rounded-full border border-indigo-100'>
          Total: {doctors.length} Doctors
        </p>
      </div>

      {/* Doctors Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-2 gap-y-6'>
        {doctors.map((item, index) => (
          <div
            className='border border-indigo-100 hover:border-primary/40 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group'
            key={index}
          >
            <div>
              <div className='relative overflow-hidden bg-indigo-50/60 h-48 flex items-center justify-center'>
                <img
                  className='w-full h-full object-cover group-hover:scale-105 transition-all duration-500'
                  src={item.image}
                  alt={item.name}
                />
                <span className='absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-gray-700 px-2 py-0.5 rounded-full shadow-sm'>
                  {item.experience || '1 Year'}
                </span>
              </div>

              <div className='p-4'>
                <div className='flex items-start justify-between gap-1'>
                  <p className='text-neutral-800 text-base font-bold line-clamp-1' title={item.name}>
                    {item.name}
                  </p>
                </div>
                <p className='text-primary text-xs font-medium mt-0.5'>{item.speciality}</p>
                <p className='text-gray-500 text-xs mt-1'>{item.degree || 'MBBS'}</p>

                <div className='flex items-center justify-between mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg'>
                  <span>Fees:</span>
                  <span className='font-semibold text-gray-800'>{currency || '$'}{item.fees}</span>
                </div>
              </div>
            </div>

            <div className='px-4 pb-4 pt-1 border-t border-gray-100 flex items-center justify-between gap-2'>
              <label className='flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none'>
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available !== false}
                  className='accent-primary w-4 h-4 cursor-pointer'
                />
                <span>Available</span>
              </label>

              <button
                onClick={() => handleEditClick(item)}
                className='flex items-center gap-1 text-xs font-medium text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-all shadow-sm'
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT DOCTOR MODAL ================= */}
      {editingDoctor && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in'>
          <div className='bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border my-auto'>
            {/* Modal Header */}
            <div className='flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10'>
              <div>
                <h2 className='text-lg font-bold text-gray-800'>Edit Doctor Information</h2>
                <p className='text-xs text-gray-500'>Update doctor profile, availability, or appointment fees</p>
              </div>
              <button
                onClick={handleCloseModal}
                className='text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-all text-xl font-bold leading-none'
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateSubmit} className='p-6 space-y-5'>
              {/* Profile Image Edit */}
              <div className='flex items-center gap-4'>
                <div className='relative group cursor-pointer'>
                  <img
                    className='w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm group-hover:opacity-75 transition-all'
                    src={newImage ? URL.createObjectURL(newImage) : editingDoctor.image}
                    alt={name}
                  />
                  <label
                    htmlFor="edit-doc-img"
                    className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-xs font-medium'
                  >
                    Change
                  </label>
                  <input
                    onChange={(e) => setNewImage(e.target.files[0])}
                    type="file"
                    id="edit-doc-img"
                    accept="image/*"
                    hidden
                  />
                </div>
                <div>
                  <p className='text-sm font-semibold text-gray-700'>Profile Photo</p>
                  <label
                    htmlFor="edit-doc-img"
                    className='text-xs text-primary hover:underline cursor-pointer font-medium'
                  >
                    Upload a new photo
                  </label>
                  <p className='text-[11px] text-gray-400 mt-0.5'>JPG, PNG or SVG recommended</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Doctor Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Email (Read-only)</label>
                  <input
                    type="email"
                    value={editingDoctor.email}
                    disabled
                    className='w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Speciality</label>
                  <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  >
                    <option value="General physician">General physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatricians">Pediatricians</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Experience</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  >
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="4 Years">4 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="6 Years">6 Years</option>
                    <option value="7 Years">7 Years</option>
                    <option value="8 Years">8 Years</option>
                    <option value="9 Years">9 Years</option>
                    <option value="10 Years">10 Years</option>
                  </select>
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Degree / Education</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Appointment Fees ({currency || '$'})</label>
                  <input
                    type="number"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    required
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Address Line 1</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    required
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  />
                </div>

                <div>
                  <label className='block text-xs font-semibold text-gray-600 mb-1'>Address Line 2</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    required
                    className='w-full border rounded-lg px-3 py-2 focus:outline-primary'
                  />
                </div>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600 mb-1'>About Doctor</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={3}
                  className='w-full border rounded-lg p-3 focus:outline-primary text-sm'
                  required
                />
              </div>

              {/* Reset Password Optional */}
              <div>
                <label className='block text-xs font-semibold text-gray-600 mb-1'>
                  New Password (Optional - leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter at least 8 characters to reset password"
                  className='w-full border rounded-lg px-3 py-2 focus:outline-primary text-sm'
                />
              </div>

              {/* Availability checkbox */}
              <div className='flex items-center gap-2 pt-1'>
                <input
                  type="checkbox"
                  id="modal-available"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                  className='accent-primary w-4 h-4 cursor-pointer'
                />
                <label htmlFor="modal-available" className='text-sm text-gray-700 cursor-pointer font-medium'>
                  Doctor is currently available for bookings
                </label>
              </div>

              {/* Modal Actions */}
              <div className='flex items-center justify-between pt-4 border-t gap-3'>
                <button
                  type="button"
                  onClick={() => handleDelete(editingDoctor._id, editingDoctor.name)}
                  className='text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 transition-all font-medium'
                >
                  Delete Doctor
                </button>

                <div className='flex items-center gap-2'>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className='text-xs text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg border transition-all font-medium'
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className='text-xs text-white bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg shadow-sm transition-all font-medium disabled:opacity-50'
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList
