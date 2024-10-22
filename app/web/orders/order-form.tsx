"use client"

import React, { useState } from 'react';
import { createOrder } from '@/actions/purchaseOrder/create-order';

const FloatingForm = () => {
    const [showError, setShowError] = useState({
        sku: false,
        group: false,
        quantity: false,
      });
      const [sku, setSku] = useState(''); 
      const [group, setGroup] = useState('');
      const [quantity, setQuantity] = useState('');
      const [vencimiento] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));// vence en 24 horas
      const [successMessage, setSuccessMessage] = useState('');

    
      const handleSkuChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSku(event.target.value);
        setShowError((prev) => ({ ...prev, sku: false })); // oculta el error al arreglarlo
      };
    
      const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGroup(event.target.value);
        setShowError((prev) => ({ ...prev, group: false })); 
      };
    
      const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(event.target.value);
        setShowError((prev) => ({ ...prev, quantity: false })); 
      };
    
      const handleSubmit = async () => { 
        const errors = {
          sku: !sku,
          group: !group,
          quantity: !quantity || parseInt(quantity, 10) <= 0,
        };
        setShowError(errors);
    
        if (!errors.sku && !errors.group && !errors.quantity) {
          try {
            const response = await createOrder({
              cliente: '9', 
              proveedor: group, 
              sku: sku,
              cantidad: parseInt(quantity, 10),
              vencimiento: vencimiento, 
            });
      
          if (response && response.id) { 
              setSuccessMessage(`Orden creada con éxito con ID = ${response.id}`); 
              console.log('Orden creada exitosamente', response);
          } else {
              console.error('Error al crear la orden');
          }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      };
      return (
        <div className="min-h-screen bg-gray-100 p-0 sm:p-12">
          <div className="mx-auto max-w-md px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
            <h1 className="text-2xl font-bold mb-8">New Order</h1>
            <form id="form" noValidate>
              {/* Selector de SKU */}
              <div className="relative z-0 w-full mb-5">
                <select
                  name="sku"
                  required
                  className={`pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 ${
                    showError.sku ? 'border-red-600' : 'border-gray-200'
                  }`}
                  value={sku}
                  onChange={handleSkuChange}
                >
                  <option value="" disabled hidden></option>
                  <option value="CAFEGRANO">CAFEGRANO</option>
                  <option value="CAFEMOLIDOPORCION">CAFEMOLIDOPORCION</option>
                  <option value="CAFEEXPRESSO">CAFEEXPRESSO</option>
                  <option value="CAFEEXPRESSODOBLE">CAFEEXPRESSODOBLE</option>
                  <option value="LECHEENTERA">LECHEENTERA</option>
                  <option value="LECHEENTERAPORPORCION">LECHEENTERAPORCION</option>
                  <option value="CAFELATTE">CAFELATTE</option>
                  <option value="CAFELATTEDLOBLE">CAFELATTEDLOBLE</option>
                  <option value="AZUCARSACHET">AZUCARSACHET</option>
                  <option value="ENDULZANTESACHET">ENDULZANTESACHET</option>
                  <option value="VASOCAFE">VASOCAFE</option>
                  <option value="VASOCAFEDOBLE">VASOCAFEDOBLE</option>
                  <option value="VASOCAFEEXPRESO">VASOCAFEEXPRESO</option>
                </select>
                <label
                  htmlFor="sku"
                  className={`absolute duration-300 top-3 -z-1 origin-0 text-gray-500 ${
                    sku ? 'scale-75 -translate-y-6' : ''
                  }`}
                >
                  Select SKU
                </label>
                {showError.sku && <span className="text-sm text-red-600">SKU is required</span>}
              </div>
    
              {/* Quantity */}
              <div className="relative z-0 w-full mb-5">
                <input
                  type="number"
                  name="quantity"
                  placeholder=" "
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={`pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 ${
                    showError.quantity ? 'border-red-600' : 'border-gray-200'
                  }`}
                />
                <label
                  htmlFor="quantity"
                  className={`absolute duration-300 top-3 -z-1 origin-0 text-gray-500 ${
                    quantity ? 'scale-75 -translate-y-6' : ''
                  }`}
                >
                  Enter Quantity
                </label>
                {showError.quantity && <span className="text-sm text-red-600">Quantity is required</span>}
              </div>
    
              {/* Selector de grupo */}
              <div className="relative z-0 w-full mb-5">
                <select
                  name="group"
                  required
                  className={`pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 ${
                    showError.group ? 'border-red-600' : 'border-gray-200'
                  }`}
                  value={group}
                  onChange={handleGroupChange}
                >
                  <option value="" disabled hidden></option>
                  {[...Array(15)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="group"
                  className={`absolute duration-300 top-3 -z-1 origin-0 text-gray-500 ${
                    group ? 'scale-75 -translate-y-6' : ''
                  }`}
                >
                  Select Group
                </label>
                {showError.group && <span className="text-sm text-red-600">Group is required</span>}
              </div>

              {/* Mensaje de orden creada con éxito */}
              {successMessage && <div className="mb-5 text-green-600">{successMessage}</div>}
    
              {/* Submit Button */}
              <button
                id="button"
                type="button"
                onClick={handleSubmit}
                className="w-full px-6 py-3 mt-3 text-lg text-white transition-all duration-150 ease-linear rounded-lg shadow outline-none bg-blue-500 hover:bg-blue-600 hover:shadow-lg focus:outline-none"
              >
                Crear Orden
              </button>
            </form>
          </div>
        </div>
      );
    };
    
    export default FloatingForm;