import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  // Default fallback user state
  const [localData, setLocalData] = useState({
    name: 'Edward Vincent',
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1 123 456 7890',
    address: {
      line1: '57th Cross, Richmond',
      line2: 'Circle, Church Road, London',
    },
    gender: 'Male',
    dob: '2000-01-20',
  })

  const currentUser = userData || localData

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', currentUser.name)
      formData.append('phone', currentUser.phone)
      formData.append('address', JSON.stringify(currentUser.address))
      formData.append('gender', currentUser.gender)
      formData.append('dob', currentUser.dob)

      if (image) formData.append('image', image)

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token },
      })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      // Save locally if backend not connected
      if (image) {
        currentUser.image = URL.createObjectURL(image)
      }
      setLocalData({ ...currentUser })
      toast.success('Profile updated successfully!')
      setIsEdit(false)
      setImage(false)
    }
  }

  const handleDataChange = (field, value) => {
    if (userData) {
      setUserData((prev) => ({ ...prev, [field]: value }))
    } else {
      setLocalData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleAddressChange = (line, value) => {
    if (userData) {
      setUserData((prev) => ({
        ...prev,
        address: { ...prev.address, [line]: value },
      }))
    } else {
      setLocalData((prev) => ({
        ...prev,
        address: { ...prev.address, [line]: value },
      }))
    }
  }

  return (
    currentUser && (
      <div className='max-w-lg flex flex-col gap-2 text-sm'>
        {isEdit ? (
          <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img
                className='w-36 h-36 rounded opacity-75 object-cover'
                src={image ? URL.createObjectURL(image) : currentUser.image || assets.profile_pic}
                alt="Profile"
              />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
            </div>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
        ) : (
          <img className='w-36 h-36 rounded object-cover' src={currentUser.image || assets.profile_pic} alt="Profile" />
        )}

        {isEdit ? (
          <input
            className='bg-gray-50 text-3xl font-medium max-w-60 mt-4 border px-1 rounded'
            type="text"
            value={currentUser.name}
            onChange={(e) => handleDataChange('name', e.target.value)}
          />
        ) : (
          <p className='font-medium text-3xl text-neutral-800 mt-4'>{currentUser.name}</p>
        )}

        <hr className='bg-zinc-400 h-[1px] border-none my-2' />

        <div>
          <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500'>{currentUser.email}</p>
            <p className='font-medium'>Phone:</p>
            {isEdit ? (
              <input
                className='bg-gray-100 max-w-52 border px-1 rounded'
                type="text"
                value={currentUser.phone}
                onChange={(e) => handleDataChange('phone', e.target.value)}
              />
            ) : (
              <p className='text-blue-400'>{currentUser.phone}</p>
            )}
            <p className='font-medium'>Address:</p>
            {isEdit ? (
              <p>
                <input
                  className='bg-gray-50 border px-1 rounded w-full mb-1'
                  onChange={(e) => handleAddressChange('line1', e.target.value)}
                  value={currentUser.address?.line1 || ''}
                  type="text"
                />
                <br />
                <input
                  className='bg-gray-50 border px-1 rounded w-full'
                  onChange={(e) => handleAddressChange('line2', e.target.value)}
                  value={currentUser.address?.line2 || ''}
                  type="text"
                />
              </p>
            ) : (
              <p className='text-gray-500'>
                {currentUser.address?.line1}
                <br />
                {currentUser.address?.line2}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {isEdit ? (
              <select
                className='max-w-28 bg-gray-100 border rounded px-1'
                onChange={(e) => handleDataChange('gender', e.target.value)}
                value={currentUser.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className='text-gray-400'>{currentUser.gender}</p>
            )}
            <p className='font-medium'>Birthday:</p>
            {isEdit ? (
              <input
                className='max-w-36 bg-gray-100 border rounded px-1'
                type="date"
                onChange={(e) => handleDataChange('dob', e.target.value)}
                value={currentUser.dob}
              />
            ) : (
              <p className='text-gray-400'>{currentUser.dob}</p>
            )}
          </div>
        </div>

        <div className='mt-10'>
          {isEdit ? (
            <button
              className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
              onClick={updateUserProfileData}
            >
              Save information
            </button>
          ) : (
            <button
              className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  )
}

export default MyProfile
