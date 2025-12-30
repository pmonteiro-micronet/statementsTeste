"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";

const NewReservationModal = ({ isOpen, onClose, propertyID }) => {
  const formatDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const calculateNights = (checkinStr, checkoutStr) => {
    try {
      const d1 = new Date(checkinStr);
      const d2 = new Date(checkoutStr);
      const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch (e) {
      return 0;
    }
  };

  const initialCheckin = formatDate(today);
  const initialCheckout = formatDate(tomorrow);
  const initialNights = calculateNights(initialCheckin, initialCheckout) || 1;

  const [form, setForm] = useState({
    checkin: initialCheckin,
    checkout: initialCheckout,
    adults: 2,
    nights: initialNights,
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [roomTypeGroups, setRoomTypeGroups] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  console.log("selectedRoomType", selectedRoomType);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkin") {
      const newCheckin = value;
      // keep nights if present, otherwise calculate from existing checkout
      const nights = Number(form.nights) || calculateNights(newCheckin, form.checkout) || 1;
      const dt = new Date(newCheckin);
      dt.setDate(dt.getDate() + Number(nights));
      setForm({ ...form, checkin: newCheckin, nights, checkout: formatDate(dt) });
      return;
    }

    if (name === "checkout") {
      const newCheckout = value;
      const nights = calculateNights(form.checkin, newCheckout);
      setForm({ ...form, checkout: newCheckout, nights });
      return;
    }

    if (name === "nights") {
      const nightsNum = Number(value) || 0;
      const dt = new Date(form.checkin);
      dt.setDate(dt.getDate() + nightsNum);
      setForm({ ...form, nights: nightsNum, checkout: formatDate(dt) });
      return;
    }

    if (name === "adults") {
      setForm({ ...form, adults: Number(value) });
      return;
    }

    setForm({ ...form, [name]: value });
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
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  // For the new flat table view we compute allDays across all products
  const allDays = Array.from(
    new Set(
      products.flatMap((p) => {
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
            <div className="w-32">
              <label className="block text-sm text-gray-400">Nights</label>
              <input
                name="nights"
                type="number"
                min={1}
                value={form.nights}
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

          {/* Flat Room Types Table (shown after search) */}
          {hasSearched && (
            <div className="w-full my-4">
              <h3 className="text-lg font-semibold mb-2">Room types</h3>
            <div className="overflow-x-auto" style={{ maxHeight: 480, overflowY: "auto" }}>
              <table className="min-w-full border text-xs">
                <thead>
                  <tr className="bg-primary text-white sticky top-0 z-40">
                    <th className="border px-2 py-2 bg-primary">Room Type</th>
                    <th className="border px-2 py-2 bg-primary">Avail. Rooms</th>
                    <th className="border px-2 py-2 bg-primary">Rate Description</th>
                    {allDays.map((day) => (
                      <th key={day} className="border px-2 py-2 bg-primary">{day}</th>
                    ))}
                    <th className="border px-2 py-2 bg-primary sticky right-0 z-40">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p, i) => {
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

                      const mainType = extractMainType(p.roomName) || "Unknown";
                      const typeInfo = roomTypeGroups.find((r) => r.type === mainType) || { count: "-" };

                      const _currency = getString(p.currency) || "EUR";
                      const _baseRateRaw = getString(p.baseRate);
                      const _amount = Number(_baseRateRaw);
                      let formattedTotal;
                      if (Number.isFinite(_amount)) {
                        if (_currency === "EUR" || _currency === "€") {
                          formattedTotal = _amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) + "\u00A0€";
                        } else {
                          formattedTotal = _amount.toLocaleString(undefined, {
                            style: "currency",
                            currency: _currency,
                            currencyDisplay: "symbol",
                          });
                        }
                      } else {
                        formattedTotal = `${_baseRateRaw} ${_currency}`;
                      }

                      return (
                        <tr key={i}>
                          <td className="border px-2 py-2">{mainType}</td>
                          <td className="border px-2 py-2">{typeInfo.count}</td>
                          <td className="border px-2 py-2">{getString(p.rateDescription)}</td>
                          {allDays.map((day) => (
                            <td key={day} className="border px-2 py-2">
                              {dailyMap[day] !== undefined && dailyMap[day] !== ""
                                ? dailyMap[day].toLocaleString(undefined, {
                                    style: "currency",
                                    currency: getString(p.currency) || "EUR",
                                  })
                                : "-"}
                            </td>
                          ))}
                          <td className="border px-2 py-2 bg-white sticky right-0 z-20 whitespace-nowrap">
                            {formattedTotal}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="border px-2 py-2 text-center" colSpan={3 + allDays.length}>No room types found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewReservationModal;