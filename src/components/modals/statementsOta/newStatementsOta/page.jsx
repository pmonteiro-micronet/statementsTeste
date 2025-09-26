"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const NewReservationModal = ({ isOpen, onClose, propertyID }) => {
  const [form, setForm] = useState({
    checkin: "",
    checkout: "",
    adults: 1,
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [roomTypeGroups, setRoomTypeGroups] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper to always return a string
  const getString = (field) => {
    if (typeof field === "string" || typeof field === "number") return field;
    if (field && typeof field === "object") {
      if (Array.isArray(field)) return field.map(getString).join(", ");
      if ("value" in field) return field.value;
      if ("amountAfterTax" in field) return field.amountAfterTax;
      return JSON.stringify(field);
    }
    return "";
  };

  // Helper to extract main type from roomName
  const extractMainType = (roomName) => {
    const str = getString(roomName);
    const idx = str.indexOf("[");
    return idx > 0 ? str.substring(0, idx).trim() : str.trim();
  };

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    setProducts([]);
    setRoomTypeGroups([]);
    setSelectedRoomType(null);
    try {
      const res = await axios.post("/api/reservations/ota/available_products", {
        propertyID,
        checkin: form.checkin,
        checkout: form.checkout,
        adults: form.adults,
      });
      const products = res.data.products || [];
      setProducts(products);

      console.log("products", products);
      console.log("rooms", res.data.rooms);

      // --- FIXED GROUPING LOGIC ---
      // 1. Map mainType -> Set of roomIds (unique, extracted from .value)
      const typeToRoomIds = {};
      products.forEach((p) => {
        const mainType = extractMainType(p.roomName) || "Unknown";
        // roomId may be { value: "19713" }
        const roomId =
          typeof p.roomId === "object" && p.roomId !== null && "value" in p.roomId
            ? String(p.roomId.value).trim()
            : String(p.roomId).trim();
        if (!typeToRoomIds[mainType]) typeToRoomIds[mainType] = new Set();
        typeToRoomIds[mainType].add(roomId);
      });

      // 2. Map roomId -> count (extract .value)
      const roomIdToCount = {};
      (res.data.rooms || []).forEach((r) => {
        const roomId =
          typeof r.roomId === "object" && r.roomId !== null && "value" in r.roomId
            ? String(r.roomId.value).trim()
            : String(r.roomId).trim();
        const count =
          typeof r.count === "object" && r.count !== null && "value" in r.count
            ? Number(r.count.value)
            : Number(r.count);
        roomIdToCount[roomId] = count || 0;
      });

      // 3. For each mainType, sum the counts of its unique roomIds
      const typeCounts = {};
      Object.entries(typeToRoomIds).forEach(([mainType, roomIds]) => {
        let sum = 0;
        roomIds.forEach((roomId) => {
          sum += roomIdToCount[roomId] || 0;
        });
        typeCounts[mainType] = sum;
      });

      setRoomTypeGroups(
        Object.entries(typeCounts).map(([type, count]) => ({
          type,
          count,
        }))
      );
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to fetch products.");
    }
    setLoading(false);
  };

  const filteredProducts = selectedRoomType
    ? products.filter((p) => extractMainType(p.roomName) === selectedRoomType)
    : [];

  // Get all unique days for the selected room type
  // Get all unique days for the selected room type
const allDays = Array.from(
  new Set(
    filteredProducts.flatMap((p) => {
      if (!p.baseDailyAmounts || !p.baseDailyAmounts.baseDailyAmount) return [];
      const arr = Array.isArray(p.baseDailyAmounts.baseDailyAmount)
        ? p.baseDailyAmounts.baseDailyAmount
        : [p.baseDailyAmounts.baseDailyAmount];
      return arr.map((d) => d.day?.value || d.day || "");
    })
  )
);

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
          Search Available Products
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
          <div className="flex gap-4 items-end">
            <div className="w-48">
              <label className="block text-sm text-gray-400">Check-in</label>
              <input
                name="checkin"
                type="date"
                value={form.checkin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div className="w-48">
              <label className="block text-sm text-gray-400">Check-out</label>
              <input
                name="checkout"
                type="date"
                value={form.checkout}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400">Adults</label>
              <input
                name="adults"
                type="number"
                min={1}
                value={form.adults}
                onChange={handleChange}
                className="w-20 border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
            <Button
              color="primary"
              onClick={handleSearch}
              disabled={loading}
              className="h-9"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Room type Accordion */}
          {roomTypeGroups.length > 0 && (
            <div className="w-full my-4">
              {roomTypeGroups.map((rt) => {
                const isOpen = selectedRoomType === rt.type;
                return (
                  <div key={rt.type} className="border rounded mb-2 overflow-hidden">
                    <button
                      className={`w-full flex justify-between items-center px-4 py-2 text-left font-semibold bg-primary/80 text-white rounded-t focus:outline-none transition-colors ${
                        isOpen ? "bg-primary" : ""
                      }`}
                      onClick={() =>
                        setSelectedRoomType(isOpen ? null : rt.type)
                      }
                    >
                      <span>
                        {rt.type} ({rt.count})
                      </span>
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out bg-white rounded-b`}
                      style={{
                        maxHeight: isOpen ? 600 : 0,
                        opacity: isOpen ? 1 : 0,
                        padding: isOpen ? "16px" : "0 16px",
                        overflow: "hidden",
                      }}
                    >
                      {isOpen && filteredProducts.length > 0 && (
                        <div className="overflow-x-auto" style={{ maxHeight: 320, overflowY: "auto" }}>
                          <table className="min-w-full border text-xs">
                            <thead>
                              <tr className="bg-primary text-white sticky top-0 z-10">
                                <th className="border px-2 py-1 bg-primary">Room Type</th>
                                <th className="border px-2 py-1 bg-primary">Total Rooms</th>
                                <th className="border px-2 py-1 bg-primary">Rate Description</th>
                                {allDays.map((day) => (
                                  <th key={day} className="border px-2 py-1 bg-primary">{day}</th>
                                ))}
                                <th className="border px-2 py-1 bg-primary sticky right-0 z-20">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredProducts.map((p, i) => {
                                // Map day -> price for this product
                                let dailyMap = {};
                                if (p.baseDailyAmounts && p.baseDailyAmounts.baseDailyAmount) {
                                  const arr = Array.isArray(p.baseDailyAmounts.baseDailyAmount)
                                    ? p.baseDailyAmounts.baseDailyAmount
                                    : [p.baseDailyAmounts.baseDailyAmount];
                                  arr.forEach((d) => {
                                    const day = d.day?.value || d.day || "";
                                    const amount = Number(
                                      typeof d.amountAfterTax === "object" && d.amountAfterTax !== null && "value" in d.amountAfterTax
                                        ? d.amountAfterTax.value
                                        : d.amountAfterTax
                                    );
                                    dailyMap[day] = amount;
                                  });
                                }
                                return (
                                  <tr key={i}>
                                    <td className="border px-2 py-1">{rt.type}</td>
                                    <td className="border px-2 py-1">{rt.count}</td>
                                    <td className="border px-2 py-1">{getString(p.rateDescription)}</td>
                                    {allDays.map((day) => (
                                      <td key={day} className="border px-2 py-1">
                                        {dailyMap[day] !== undefined && dailyMap[day] !== ""
                                          ? dailyMap[day].toLocaleString(undefined, {
                                              style: "currency",
                                              currency: getString(p.currency) || "EUR",
                                            })
                                          : "-"}
                                      </td>
                                    ))}
                                    <td className="border px-2 py-1 bg-white sticky right-0 z-20">
                                      {getString(p.baseRate)} {getString(p.currency)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewReservationModal;