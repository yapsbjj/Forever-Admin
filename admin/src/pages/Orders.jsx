import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/admin_assets/assets'

const Orders = ( { token }) => {

  const [orders,setOrders] = useState([])

  const fetchAllorders = async ()=> {

    if (!token) {
      return null
    } 

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers:{ token } })
      
      if (response.data.success) {
        setOrders(response.data.orders)
      } else{
        toast.error(response.data.message)
      }
      

    } catch (error) {
      toast.error(error.message)
    }

  }

  const statusHandler = async ( event, orderId )=> {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value }, { headers: {token} })

        if (response.data.success) {

          await fetchAllorders()
        }
      
    } catch (error) {

      console.log(error);
      toast.error(response.data.message)
      
    }
  }

  useEffect(()=>{
    fetchAllorders();
  },[token])

  return (
    <div>

      <h3>Toutes les commandes</h3>

      <div>
        {
          orders.map((order,index)=> (

            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] gap-3 items-start border-2 border-gray-200 p-5
             md:p-8 my-3 md:my-4 text-xs 
             sm:text-sm text-gray-700' key={index}>

            <div>
                <img src={assets.parcel_icon} alt="" />
                <div>

                  {order.items.map((item,index)=>{
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size}</span></p>
                    } 
                    else {
                      return <p className='py-0.5' key={index}>{item.name} x {item.quantity} <span>{item.size} ,</span></p>
                    }

                  })}

                </div>

                <p className='mt-3 mb-2 font-medium'>{order.adress.firstname + " " + order.adress.lastname}</p>
                <div>
                  <p>{order.adress.street + ","}</p>
                  <p>{order.adress.city + ", "  + order.adress.country + ", " + order.adress.zipcode}</p>
                </div>
                <p>{order.adress.phone}</p>
            </div>

            <div>
              <p className='text-sm sm:text-[15px]'>Items : { order.items.length }</p>
              <p className='mt-3'> Méthode de paiement : {order.paymentMethod}</p>
              <p> Paiement : { order.payment ? 'Réglé' : 'En attente de règlement'}</p>
              <p> Date : { new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{order.amount} €</p>
            <select onChange={(event)=>statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
              <option value="Commande enregistrée">Commande enregistrée</option>
              <option value="En préparation">Commande en préparation</option>
              <option value="Indisponible">Indisponible</option>
              <option value="Livrée">Commande livrée</option>
            </select>
            </div>
          ))
        }
      </div>
      
    </div>
  )
}

export default Orders
