import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialtyMenu = () => {
    return (
        <div id='specialty' className='flex flex-col items-center gap-4 py-16 text-gray-800'>
            <h1 className='text-2xl font-medium'>Find by Specialty</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simple browse through our extensive list of trusted doctors, schedule you appointment hassle-free.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
                {specialityData.map((item, index) => (
                    <Link onClick={() =>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'  key={index} to={`/doctors/${item.speciality}`}>
                        <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialtyMenu