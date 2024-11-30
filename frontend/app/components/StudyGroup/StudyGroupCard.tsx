"use client"
import React from 'react'

// const book = require('../../public/Images/mynaui_book-open.svg');
import people from '../../../public/Images/fluent_people-16-regular.svg'
import Image from 'next/image'
import {studyGroupType } from '@/types/cardType';
import { useTranslations } from 'next-intl';

interface Props{
    info: studyGroupType
}


const StudyGroupCard = ({info}: Props) => {
    const t = useTranslations("StudyGroup")

    return (
            <div className='w-full h-52 p-4 flex flex-col shadow-md justify-between rounded-3xl bg-white'>
                <div className='flex justify-between w-full align-middle'>
                    <div>
                        <h1 className='text-2xl font-bold'>{info.groupName}</h1>
                        <h1 className='text-sm text-[#656565]'>{info.courseName}</h1>
                    </div>
                    {/* <div>
                        <h1 className='text-xs rounded-full px-2 mt-2 bg-[#EAEAEA]'>{info.season}</h1>
                    </div> */}
                </div>
                <div className='flex justify-between w-full'>
                    {/* <div className=' flex justify-center align-middle space-x-2'>
                        <Image className='w-5' src={book} alt=''/>
                        <h1 className='text-sm mt-1 font-semibold'>{info.teacher}</h1>
                    </div> */}
                    <div className=' flex justify-center align-middle space-x-1'>
                        <Image className='w-6' src={people} alt=''/>
                        <h1 className='text-lg font-semibold'>{info.numMembers} {t("Students")}</h1>
                    </div>
                </div>
            </div>
  )
}

export default StudyGroupCard