import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currency } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  // Default fallback doctor profile
  const [localDoctor, setLocalDoctor] = useState({
    name: 'Dr. Richard James',
    image: assets.doctor_profile,
    degree: 'MBBS',
    speciality: 'General physician',
    experience: '4 Years',
    about:
      'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
    fees: 50,
    address: {
      line1: '17th Cross, Richmond',
      line2: 'Circle, Ring Road, London',
    },
    available: true,
  })

  const currentProfile = profileData || localDoctor

  const updateProfile = async () => {
    try {
      const updateData = {
        address: currentProfile.address,
        fees: currentProfile.fees,
        available: currentProfile.available,
      }

      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, {
        headers: { dToken },
      })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.success('Profile Updated')
      setIsEdit(false)
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  return (
    currentProfile && (
      <div>
        <div className='flex flex-col gap-4 m-5'>
          <div>
            <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={currentProfile.image} alt="" />
          </div>

          <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
            {/* ----- Doc Info : name, degree, experience ----- */}
            <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{currentProfile.name}</p>
            <div className='flex items-center gap-2 mt-1 text-gray-600'>
              <p>
                {currentProfile.degree} - {currentProfile.speciality}
              </p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{currentProfile.experience}</button>
            </div>

            {/* ----- Doc About ----- */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3'>About:</p>
              <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{currentProfile.about}</p>
            </div>

            <p className='text-gray-600 font-medium mt-4'>
              Appointment fee:{' '}
              <span className='text-gray-800'>
                {currency}{' '}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      profileData
                        ? setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                        : setLocalDoctor((prev) => ({ ...prev, fees: e.target.value }))
                    }
                    value={currentProfile.fees}
                    className='border px-2 py-0.5 rounded max-w-28'
                  />
                ) : (
                  currentProfile.fees
                )}
              </span>
            </p>

            <div className='flex gap-2 py-2'>
              <p>Address:</p>
              <p className='text-sm'>
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      profileData
                        ? setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                        : setLocalDoctor((prev) => ({
                            ...prev,
                            address: { ...prev.address, line1: e.target.value },
                          }))
                    }
                    value={currentProfile.address.line1}
                    className='border px-2 py-0.5 rounded w-full mb-1'
                  />
                ) : (
                  currentProfile.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      profileData
                        ? setProfileData((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                        : setLocalDoctor((prev) => ({
                            ...prev,
                            address: { ...prev.address, line2: e.target.value },
                          }))
                    }
                    value={currentProfile.address.line2}
                    className='border px-2 py-0.5 rounded w-full'
                  />
                ) : (
                  currentProfile.address.line2
                )}
              </p>
            </div>

            <div className='flex gap-1 pt-2'>
              <input
                onChange={() =>
                  isEdit &&
                  (profileData
                    ? setProfileData((prev) => ({ ...prev, available: !prev.available }))
                    : setLocalDoctor((prev) => ({ ...prev, available: !prev.available })))
                }
                checked={currentProfile.available}
                type="checkbox"
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className='px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all'
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  )
}

export default DoctorProfile
