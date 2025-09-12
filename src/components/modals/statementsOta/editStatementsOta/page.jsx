"use client";
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import axios from "axios";

import en from "../../../../../public/locales/english/common.json";
import pt from "../../../../../public/locales/portuguesPortugal/common.json";
import es from "../../../../../public/locales/espanol/common.json";

const translations = { en, pt, es };

const EditReservationModal = ({
  isOpen,
  onClose,
  onSaved,
  propertyID,
  initialReservation = {},
  initialRoom = {},
  initialDayPrices = []
}) => {
  const [locale, setLocale] = useState("pt");
  console.log(locale);
  const t = translations[locale] || translations["pt"];

  const [activeTab, setActiveTab] = useState("reservation");

  const [reservation, setReservation] = useState({
    id: "",
    creation_date: "",
    checkin: "",
    checkout: "",
    firstName: "",
    lastName: "",
    adults: "",
    childs: "",
    price: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [room, setRoom] = useState({
    id: "",
    rateId: "",
    quantity: "",
    price: "",
    adults: "",
  });

  const [dayPrices, setDayPrices] = useState(
    initialDayPrices.length > 0
      ? initialDayPrices
      : [{ day: "", roomId: "", rateId: "", price: "" }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const safeReservation = initialReservation || {};
    setReservation({
      id: safeReservation.ResNo || "",
      creation_date: safeReservation.creation_date || "",
      checkin: safeReservation.Arrival ? safeReservation.Arrival.split("T")[0] : "",
      checkout: safeReservation.Departure ? safeReservation.Departure.split("T")[0] : "",
      firstName: safeReservation.FirstName || "",
      lastName: safeReservation.Lastname || "",
      adults: safeReservation.Adults || "",
      childs: safeReservation.Childs || "",
      price: safeReservation.Price || "",
      email: safeReservation.Email || "",
      telephone: safeReservation.Telephone || "",
      address: safeReservation.Address || "",
      city: safeReservation.City || "",
      zipCode: safeReservation.ZipCode || "",
      country: safeReservation.Country || "",
    });

    setRoom({
      id: initialRoom.id || safeReservation.Room || "",
      rateId: initialRoom.rateId || safeReservation["Rate Code"] || "",
      quantity: initialRoom.quantity || safeReservation.Quantity || "",
      price: initialRoom.price || safeReservation.Price || "",
      adults: initialRoom.adults || safeReservation.Adults || "",
    });

    setDayPrices(
      initialDayPrices.length > 0
        ? initialDayPrices
        : [{ day: "", roomId: "", rateId: "", price: "" }]
    );
  }, [initialReservation, initialRoom, initialDayPrices]);

  const handleReservationChange = (e) => {
    setReservation({ ...reservation, [e.target.name]: e.target.value });
  };

  const handleRoomChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  const handleDayPriceChange = (idx, e) => {
    const updated = [...dayPrices];
    updated[idx][e.target.name] = e.target.value;
    setDayPrices(updated);
  };
  const addDayPrice = () =>
    setDayPrices([...dayPrices, { day: "", roomId: "", rateId: "", price: "" }]);
  const removeDayPrice = (idx) =>
    setDayPrices(dayPrices.filter((_, i) => i !== idx));

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        propertyID,
        id: reservation.id,
        creation_date: reservation.creation_date,
        checkin: reservation.checkin,
        checkout: reservation.checkout,
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        telephone: reservation.telephone,
        address: reservation.address,
        city: reservation.city,
        zipCode: reservation.zipCode,
        country: reservation.country,
        rooms: "1",
        adults: reservation.adults,
        price: reservation.price,
        status: "8", // Always 8 for edit
        currency: "EUR",
        lang: locale,
        room_id: room.id,
        rateId: room.rateId,
        room_quantity: room.quantity,
        room_price: room.price,
        room_adults: room.adults,
        room_status: "8", // Always 8 for edit
        room_checkin: reservation.checkin,
        room_checkout: reservation.checkout,
        room_currency: "EUR",
        dayPrices: dayPrices.map((dp) => ({
          day: dp.day,
          roomId: room.id,
          rateId: room.rateId,
          price: dp.price,
        })),
      };

      await axios.post(
        "/api/reservations/reservationsOta/create_reservation_4_ota",
        payload
      );
      setLoading(false);
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      setError("Failed to save reservation.");
      setLoading(false);
      console.log(err)
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      className="z-50"
      size="2xl"
      hideCloseButton={true}
      backdrop="opaque"
    >
      <ModalContent>
        <ModalHeader className="flex flex-row justify-between items-center gap-1 p-2 px-4 bg-primary text-white">
          {t?.modals?.editReservation?.title || "Edit Reservation"}
          <Button
            color="transparent"
            variant="light"
            onClick={onClose}
            className="w-auto min-w-0 p-0 m-0"
          >
            <MdClose size={30} />
          </Button>
        </ModalHeader>
        <ModalBody className="flex flex-col mx-5 my-5 space-y-6 text-textPrimaryColor">
          {/* Centered, bordered, rounded tabs */}
          <div className="flex justify-center mb-4">
            <div className="flex border border-gray-300 rounded-lg bg-white p-1 gap-0 w-fit">
              <button
                className={`px-6 py-2 font-semibold rounded-md transition-colors
                  ${activeTab === "reservation"
                    ? "bg-primary text-white border border-primary shadow"
                    : "bg-transparent text-gray-700 border border-transparent"
                  }`}
                style={{ minWidth: 120 }}
                onClick={() => setActiveTab("reservation")}
                type="button"
              >
                {t?.modals?.editReservation?.reservationSection || "Reservation"}
              </button>
              <button
                className={`px-6 py-2 font-semibold rounded-md transition-colors
                  ${activeTab === "room"
                    ? "bg-primary text-white border border-primary shadow"
                    : "bg-transparent text-gray-700 border border-transparent"
                  }`}
                style={{ minWidth: 120 }}
                onClick={() => setActiveTab("room")}
                type="button"
              >
                {t?.modals?.editReservation?.roomSection || "Room"}
              </button>
            </div>
          </div>
          {/* Tab Content */}
          {activeTab === "reservation" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">ID</label>
                  <input name="id" value={reservation.id} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Creation Date</label>
                  <input name="creation_date" type="date" value={reservation.creation_date} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Check-in</label>
                  <input name="checkin" type="date" value={reservation.checkin} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Check-out</label>
                  <input name="checkout" type="date" value={reservation.checkout} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">First Name</label>
                  <input name="firstName" value={reservation.firstName} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Last Name</label>
                  <input name="lastName" value={reservation.lastName} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Adults</label>
                  <input name="adults" type="number" value={reservation.adults} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Childs</label>
                  <input name="childs" type="number" value={reservation.childs} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Price</label>
                  <input name="price" type="number" value={reservation.price} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <input name="email" value={reservation.email || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Telephone</label>
                  <input name="telephone" value={reservation.telephone || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Address</label>
                  <input name="address" value={reservation.address || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">City</label>
                  <input name="city" value={reservation.city || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Zip Code</label>
                  <input name="zipCode" value={reservation.zipCode || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Country</label>
                  <input name="country" value={reservation.country || ""} onChange={handleReservationChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
              </div>
            </div>
          )}
          {activeTab === "room" && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400">ID</label>
                  <input name="id" value={room.id} onChange={handleRoomChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Rate ID</label>
                  <input name="rateId" value={room.rateId} onChange={handleRoomChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Quantity</label>
                  <input name="quantity" type="number" value={room.quantity} onChange={handleRoomChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Price</label>
                  <input name="price" type="number" value={room.price} onChange={handleRoomChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Adults</label>
                  <input name="adults" type="number" value={room.adults} onChange={handleRoomChange} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                </div>
              </div>
              {/* Day Prices */}
              <div className="mt-4">
                <label className="block text-sm text-gray-400 mb-2">Day Prices</label>
                {dayPrices.map((dp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      name="day"
                      type="date"
                      value={dp.day}
                      onChange={e => handleDayPriceChange(idx, e)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                      placeholder="Day"
                    />
                    <input
                      name="price"
                      type="number"
                      value={dp.price}
                      onChange={e => handleDayPriceChange(idx, e)}
                      className="border border-gray-300 rounded-md px-2 py-1"
                      placeholder="Price"
                    />
                    <Button color="error" onClick={() => removeDayPrice(idx)} disabled={dayPrices.length === 1}>-</Button>
                  </div>
                ))}
                <Button color="primary" onClick={addDayPrice}>Add Day Price</Button>
              </div>
            </div>
          )}
          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button color="error" onClick={onClose}>
              {t?.modals?.propertiesEdit?.cancel || "Cancel"}
            </Button>
            <Button color="primary" onClick={handleSave} disabled={loading}>
              {loading ? (t?.modals?.propertiesEdit?.saving || "Saving...") : (t?.modals?.propertiesEdit?.save || "Save")}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditReservationModal;