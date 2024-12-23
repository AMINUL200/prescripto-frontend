import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const month = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const navigate = useNavigate();

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + month[Number(dateArray[1])] + " " + dateArray[2];
  }

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
      if (data.success) {
        toast.success('Appointment cancelled successfully');
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.message);
    }
  }

  const appointmentpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/payment', { appointmentId }, { headers: { token } });

      if (data.success) {
        const { paymentId } = data;
        const verifyData = await axios.post(backendUrl + '/api/user/verify-payment', { paymentId, appointmentId }, { headers: { token } });
        console.log(verifyData);

        if (verifyData.data.success) {
          console.log("Verified payment");
          toast.success('Payment verified successfully');
          getUserAppointments();
          navigate('/my-appointments');
        } else {
          toast.error(verifyData.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error during payment:', error);
      toast.error(error.message);
    }
  };




  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-sm mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentpay(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-500'
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-500'
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 text-green-500'>Completed</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-zinc-500 mt-4'>No appointments found</p>
        )}
      </div>
    </div>
  );
}

export default MyAppointments;
