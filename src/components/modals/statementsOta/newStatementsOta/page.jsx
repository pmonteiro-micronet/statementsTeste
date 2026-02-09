"use client";
import React, { useState } from "react";
import axios from "axios";
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@heroui/react";
import { MdClose } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import CheckoutForm from "./CheckoutForm";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
  "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City",
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const PAYMENT_TYPES = ["Transfer", "Postal Order", "Credit Card", "Voucher", "Cash"];

const CheckoutModal = ({ isOpen, onClose, onSubmit, cartTotal, cartItemsCount }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    paymentType: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.paymentType) newErrors.paymentType = "Payment type is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full space-y-6 text-textPrimaryColor">
      {/* Personal Information */}
      <div>
        <h3 className="font-semibold text-base mb-4 text-gray-800">Personal Information</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="font-semibold text-base mb-4 text-gray-800">Address Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="123 Main Street"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.postalCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="12345"
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="New York"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Country --</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
      </div>

      {/* Payment Information */}
      <div>
        <h3 className="font-semibold text-base mb-4 text-gray-800">Payment Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type of Payment *</label>
          <select
            name="paymentType"
            value={formData.paymentType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.paymentType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Select Payment Type --</option>
            {PAYMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.paymentType && <p className="text-red-500 text-xs mt-1">{errors.paymentType}</p>}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="text-sm text-gray-600 mb-2">
          <span>Items in cart: </span>
          <span className="font-semibold">{cartItemsCount}</span>
        </div>
        <div className="text-lg font-semibold flex justify-between text-gray-800">
          <span>Total:</span>
          <span>{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          color="default"
          variant="bordered"
          onClick={onClose}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          className="flex-1"
        >
          Complete Booking
        </Button>
      </div>
    </div>
  );
};

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
      console.error("Error calculating nights:", e);
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
  const [roomTypeAvailabilityByDay, setRoomTypeAvailabilityByDay] = useState({});
  const [allDays, setAllDays] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  console.log("selectedRoomType", selectedRoomType);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedAdults, setSearchedAdults] = useState(null);

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
      // build list of days between checkin (inclusive) and checkout (exclusive)
      const days = [];
      const start = new Date(form.checkin);
      const nights = Number(form.nights) || calculateNights(form.checkin, form.checkout) || 1;
      for (let i = 0; i < nights; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(formatDate(d));
      }

      setAllDays(days);

      // perform requests per day and per person count (1..adults)
      const maxAdults = Number(form.adults) || 1;
      const requests = [];
      for (const day of days) {
        const dt = new Date(day);
        dt.setDate(dt.getDate() + 1);
        const nextDay = formatDate(dt);
        for (let persons = 1; persons <= maxAdults; persons++) {
          requests.push(
            axios
              .post("/api/reservations/ota/available_products", {
                propertyID,
                checkin: day,
                checkout: nextDay,
                adults: persons,
              })
              .then((r) => ({ day, persons, res: r }))
          );
        }
      }

      const results = await Promise.all(requests);

      // aggregate products by a stable key and collect daily prices
      const prodMap = new Map();
      const availabilityByDay = {}; // { [mainType]: { [day]: count } }

      results.forEach(({ day, persons, res }) => {
        const dayProducts = res.data.products || [];

        // build room counts for this day (roomId -> count)
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

        // compute per-mainType availability for this day
        const typeToRoomIds = {};
        dayProducts.forEach((p) => {
          const mainType = extractMainType(p.roomName) || "Unknown";
          const roomId =
            typeof p.roomId === "object" && p.roomId !== null && "value" in p.roomId
              ? String(p.roomId.value).trim()
              : String(p.roomId).trim();
          if (!typeToRoomIds[mainType]) typeToRoomIds[mainType] = new Set();
          typeToRoomIds[mainType].add(roomId);
        });

        Object.entries(typeToRoomIds).forEach(([mainType, roomIds]) => {
          let sum = 0;
          roomIds.forEach((roomId) => {
            sum += roomIdToCount[roomId] || 0;
          });
          if (!availabilityByDay[mainType]) availabilityByDay[mainType] = {};
          availabilityByDay[mainType][day] = sum;
        });

        // now aggregate product prices per day
        dayProducts.forEach((p) => {
          const key = `${getString(p.roomId)}|${getString(p.rateDescription)}|${getString(p.baseRate)}|${persons}`;
          if (!prodMap.has(key)) {
            prodMap.set(key, {
              key,
              roomId: getString(p.roomId),
              rateId: getString(p.rateId),
              roomName: p.roomName,
              rateDescription: p.rateDescription,
              currency: getString(p.currency) || "EUR",
              dailyPrices: {},
              baseRate: getString(p.baseRate),
              baseDailyAmounts: p.baseDailyAmounts,
              persons,
              raw: p,
            });
          }

          const entry = prodMap.get(key);

          // try to extract the day's amount from baseDailyAmounts, fallback to baseRate
          let amount = NaN;
          if (p.baseDailyAmounts && p.baseDailyAmounts.baseDailyAmount) {
            const arr = Array.isArray(p.baseDailyAmounts.baseDailyAmount)
              ? p.baseDailyAmounts.baseDailyAmount
              : [p.baseDailyAmounts.baseDailyAmount];
            const found = arr.find((d) => (d.day?.value || d.day || "") === day) || arr[0];
            if (found) {
              amount = Number(
                typeof found.amountAfterTax === "object" && found.amountAfterTax !== null && "value" in found.amountAfterTax
                  ? found.amountAfterTax.value
                  : found.amountAfterTax
              );
            }
          }
          if (!Number.isFinite(amount)) {
            amount = Number(getString(p.baseRate));
          }
          entry.dailyPrices[day] = Number.isFinite(amount) ? amount : null;
        });
      });

      // convert prodMap to array
      const aggregated = Array.from(prodMap.values());

      // build roomTypeGroups as max availability across days (useful summary)
      const typeGroups = Object.entries(availabilityByDay).map(([type, byDay]) => {
        const vals = Object.values(byDay).map((v) => Number(v || 0));
        const max = vals.length ? Math.max(...vals) : 0;
        return { type, count: max };
      });

      setProducts(aggregated);
      setRoomTypeGroups(typeGroups);
      setRoomTypeAvailabilityByDay(availabilityByDay);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to fetch products.");
    } finally {
      setLoading(false);
      setHasSearched(true);
      setSearchedAdults(Number(form.adults) || 1);
    }
  };

  // allDays is computed from the search (one request per day) and stored in state

  const personRange = Array.from({ length: Number(searchedAdults || form.adults) || 1 }, (_, i) => i + 1);

  const setQty = (key, qty, max) => {
    const q = Math.max(1, Math.min(Number(qty) || 1, Number(max || 9999)));
    setCartQuantities((s) => ({ ...s, [key]: q }));
  };

  const originalAvailabilityForMainType = (mainType) => {
    try {
      const byDay = roomTypeAvailabilityByDay[mainType] || {};
      const vals = allDays.map((d) => Number(byDay[d] || 0));
      return vals.length ? Math.min(...vals) : 0;
    } catch (e) {
      return 0;
    }
  };

  const getAvailableStock = (p, excludeKey) => {
    try {
      const mainType = extractMainType(p.roomName) || "Unknown";
      const original = originalAvailabilityForMainType(mainType);
      const booked = cartItems.reduce((s, it) => {
        if (excludeKey && it.key === excludeKey) return s;
        const mt = extractMainType(it.product.roomName) || "Unknown";
        if (mt === mainType) return s + Number(it.qty || 0);
        return s;
      }, 0);
      return Math.max(0, original - booked);
    } catch (e) {
      return 0;
    }
  };

  const getBookedForMainTypeOnDay = (mainType, day, excludeKey) => {
    return cartItems.reduce((s, it) => {
      if (excludeKey && it.key === excludeKey) return s;
      const mt = extractMainType(it.product.roomName) || "Unknown";
      if (mt === mainType) return s + Number(it.qty || 0);
      return s;
    }, 0);
  };

  const getAdjustedAvailability = (mainType, day, excludeKey) => {
    const orig = Number((roomTypeAvailabilityByDay[mainType] && roomTypeAvailabilityByDay[mainType][day]) || 0);
    const booked = getBookedForMainTypeOnDay(mainType, day, excludeKey);
    return Math.max(0, orig - booked);
  };

  const getRowTotal = (p) => {
    const dailyMap = p.dailyPrices || {};
    return allDays.reduce((s, d) => s + (Number.isFinite(dailyMap[d]) ? dailyMap[d] : 0), 0);
  };

  // Total capacity from selected cart items (uses product.persons as capacity per unit)
  const totalSelectedCapacity = () => {
    return cartItems.reduce((s, it) => s + ((Number(it.product.persons) || 0) * (Number(it.qty) || 0)), 0);
  };

  // Number of guests from the last search (fallback to current form.adults)
  const requiredCapacity = Number(searchedAdults || form.adults || 1);

  const canProceedToCheckout = () => {
    return totalSelectedCapacity() >= requiredCapacity;
  };

  const addToCart = (p) => {
    const key = p.key;
    const desired = 1;
    const maxAllowed = getAvailableStock(p, key); // exclude this product's existing qty
    const existing = (cartItems.find((it) => it.key === key) || {}).qty || 0;
    if (existing + desired > maxAllowed) {
      setError(`Cannot add more than available stock (${maxAllowed}).`);
      return;
    }
    setError(null);
    setCartItems((prev) => {
      const found = prev.find((it) => it.key === key);
      if (found) {
        return prev.map((it) => (it.key === key ? { ...it, qty: it.qty + desired } : it));
      }
      return [...prev, { key, product: p, qty: desired }];
    });
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((it) => it.key !== key));
  };

  const handleCheckoutSubmit = async (formData) => {
    // Combine cart items and form data
    const bookingData = {
      booking: formData,
      items: cartItems.map(it => ({
        roomId: it.product.roomId,
        rateId: it.product.rateId,
        roomName: it.product.roomName,
        quantity: it.qty,
        price: (it.product.baseRate || 0) * it.qty * form.nights,
        ratePerNight: it.product.baseRate,
        totalForItem: (it.product.baseRate || 0) * it.qty * form.nights
      })),
      dates: {
        checkin: form.checkin,
        checkout: form.checkout,
        nights: form.nights,
        adults: form.adults
      },
      total: cartItems.reduce((sum, it) => sum + ((it.product.baseRate || 0) * it.qty * form.nights), 0)
    };
    
    try {
      setLoading(true);
      const response = await axios.post('/api/reservations/ota/book', {
        propertyID,
        bookingData
      });

      if (response.data.success) {
        alert(`Booking submitted successfully!\nReservation ID: ${response.data.reservationId}`);
        setShowCheckout(false);
        setShowCart(false);
        setCartItems([]);
        setCartQuantities({});
        // Optionally close the main modal
        onClose();
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      alert(`Booking failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
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
        <ModalBody className="flex flex-col mx-5 my-5 space-y-6 text-textPrimaryColor relative">
          <div className="max-h-[70vh] overflow-auto pr-2">
          
          {!showCheckout ? (
            <>
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

          {/* Accordion: one table per person count (shown after search) */}
          {hasSearched && !showCheckout && (
            <div className="w-full my-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Room types</h3>
                <div className="flex items-center gap-3">
                  {/*<div className="text-sm text-gray-600">Items: {cartItems.reduce((s, it) => s + it.qty, 0)}</div>*/}
                  <button
                    onClick={() => setShowCart(true)}
                    aria-label="Open cart"
                    className="relative bg-primary text-white p-2 rounded flex items-center justify-center"
                  >
                    <FaShoppingCart size={18} />
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.reduce((s, it) => s + it.qty, 0)}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {personRange.map((persons) => {
                  // products for this person count
                  const prodsForPersons = products.filter((pp) => Number(pp.persons) === Number(persons));

                  // group by mainType
                  const grouped = prodsForPersons.reduce((acc, p) => {
                    const mainType = extractMainType(p.roomName) || "Unknown";
                    if (!acc[mainType]) acc[mainType] = [];
                    acc[mainType].push(p);
                    return acc;
                  }, {});

                  return (
                    <details key={`persons-${persons}`} className="border rounded-md" open={persons === 1}>
                      <summary className="px-3 py-2 bg-gray-100 cursor-pointer font-medium">For {persons} person{persons > 1 ? "s" : ""} ({prodsForPersons.length} products)</summary>
                      <div className="overflow-x-auto" style={{ maxHeight: 420, overflowY: "auto" }}>
                        <table className="min-w-full border text-xs">
                          <thead>
                            <tr className="bg-primary text-white sticky top-0 z-40">
                                <th className="border px-2 py-2 bg-primary">Room Type</th>
                                <th className="border px-2 py-2 bg-primary">Rate Description</th>
                                {allDays.map((day) => (
                                  <th key={`${persons}-${day}`} className="border px-2 py-2 bg-primary">{day}</th>
                                ))}
                                <th className="border px-2 py-2 bg-primary sticky right-0 z-40">Total</th>
                              </tr>
                          </thead>
                          <tbody>
                            {prodsForPersons.length > 0 ? (
                              (() => {
                                const rows = [];
                                Object.entries(grouped).forEach(([mainType, prods]) => {
                                  // availability row
                                  rows.push(
                                    <tr key={`avail-${persons}-${mainType}`} className="bg-gray-100">
                                      <td className="border px-2 py-2 font-semibold">{mainType}</td>
                                      <td className="border px-2 py-2">Availability</td>
                                      {allDays.map((day) => (
                                        <td key={`${persons}-${day}-avail`} className="border px-2 py-2 text-center">
                                          {roomTypeAvailabilityByDay[mainType] && roomTypeAvailabilityByDay[mainType][day] !== undefined
                                            ? getAdjustedAvailability(mainType, day)
                                            : "-"}
                                        </td>
                                      ))}
                                      <td className="border px-2 py-2 bg-white sticky right-0 z-20" />
                                    </tr>
                                  );

                                  prods.forEach((p, idx) => {
                                    const dailyMap = p.dailyPrices || {};
                                    const total = Object.values(dailyMap).reduce((s, v) => s + (Number.isFinite(v) ? v : 0), 0);
                                    const currency = p.currency || "EUR";
                                    const formatAmount = (amt) => {
                                      if (!Number.isFinite(amt)) return "-";
                                      if (currency === "EUR" || currency === "€") {
                                        return amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u00A0€";
                                      }
                                      return amt.toLocaleString(undefined, { style: "currency", currency });
                                    };

                                    const available = getAvailableStock(p, p.key);
                                    const qtyState = cartQuantities[p.key] || 1;

                                    rows.push(
                                      <tr key={`p-${persons}-${mainType}-${idx}`} onClick={() => addToCart(p)} className="cursor-pointer hover:bg-gray-50">
                                        <td className="border px-2 py-2">{mainType}</td>
                                        <td className="border px-2 py-2">{getString(p.rateDescription)}</td>
                                        {allDays.map((day) => (
                                          <td key={`${persons}-${day}-${idx}`} className="border px-2 py-2 align-center">
                                            <div className="mt-1">{dailyMap[day] !== undefined && dailyMap[day] !== null ? formatAmount(dailyMap[day]) : "-"}</div>
                                          </td>
                                        ))}
                                        {/*<td className="border px-2 py-2 align-center">
                                          <div className="text-xs text-gray-500">Stock: {available}</div>
                                        </td>*/}
                                        <td className="border px-2 py-2 align-center bg-white sticky right-0 z-20 whitespace-nowrap">{formatAmount(total)}</td>
                                      </tr>
                                    );
                                  });
                                });
                                return rows;
                              })()
                            ) : (
                              <tr>
                                <td className="border px-2 py-2 text-center" colSpan={2 + allDays.length + 1}>No room types found for {persons} person{persons > 1 ? "s" : ""}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  );
                })}
              </div>
              
              {/* Proceed to Checkout Button */}
              {cartItems.length > 0 && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowCart(true)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300"
                  >
                    View Cart ({cartItems.reduce((s, it) => s + it.qty, 0)} items)
                  </button>
                  <button
                    onClick={() => {
                      if (!canProceedToCheckout()) {
                        setError(`Selected rooms capacity (${totalSelectedCapacity()}) is less than required (${requiredCapacity}).`);
                        return;
                      }
                      setShowCheckout(true);
                    }}
                    disabled={cartItems.length === 0 || !canProceedToCheckout()}
                    className="flex-1 bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 disabled:bg-gray-300"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          )}

          {showCart && !showCheckout && (
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg z-50 p-4">
              <div className="flex justify-between items-center mb-3">
                <strong>Cart</strong>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowCart(false)} className="px-2 py-1 border rounded">Close</button>
                </div>
              </div>
              {cartItems.length === 0 ? (
                <div className="text-sm text-gray-500">Cart is empty</div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((it) => {
                    const available = getAvailableStock(it.product, it.key);
                    const rowTotal = getRowTotal(it.product) * it.qty;
                    return (
                      <div key={`cart-${it.key}`} className="border-b pb-2">
                        <div className="font-medium">{extractMainType(it.product.roomName)}</div>
                        <div className="text-xs text-gray-600">{getString(it.product.rateDescription)}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button onClick={() => {
                              const maxAllowed = getAvailableStock(it.product, it.key);
                              const newQty = Math.max(1, it.qty - 1);
                              if (newQty <= maxAllowed) setCartItems(prev => prev.map(x => x.key === it.key ? {...x, qty: newQty} : x));
                            }} className="px-2 py-1 border rounded">-</button>
                            <input type="number" min={1} max={available} value={it.qty} onChange={(e) => {
                              const maxAllowed = getAvailableStock(it.product, it.key);
                              const v = Math.max(1, Math.min(Number(e.target.value) || 1, maxAllowed));
                              setCartItems(prev => prev.map(x => x.key === it.key ? {...x, qty: v} : x));
                            }} className="w-16 text-center border rounded px-1" />
                            <button onClick={() => {
                              const maxAllowed = getAvailableStock(it.product, it.key);
                              setCartItems(prev => prev.map(x => x.key === it.key ? {...x, qty: Math.min(maxAllowed, x.qty + 1)} : x));
                            }} className="px-2 py-1 border rounded">+</button>
                            <div className="text-xs text-gray-500">Stock: {available}</div>
                          </div>
                          <div className="text-sm font-medium">{rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u00A0€"}</div>
                        </div>
                        <div className="mt-2 text-right">
                          <button onClick={() => removeFromCart(it.key)} className="text-sm text-red-500">Remove</button>
                        </div>
                      </div>
                    );
                  })}

                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-semibold mb-3">
                      <div>Total</div>
                      <div>{cartItems.reduce((s, it) => s + getRowTotal(it.product) * it.qty, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "\u00A0€"}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (!canProceedToCheckout()) {
                          setError(`Selected rooms capacity (${totalSelectedCapacity()}) is less than required (${requiredCapacity}).`);
                          return;
                        }
                        setShowCart(false);
                        setShowCheckout(true);
                      }}
                      disabled={cartItems.length === 0 || !canProceedToCheckout()}
                      className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 disabled:bg-gray-300"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Booking Details</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <span>←</span>
                  Back to Products
                </button>
              </div>

              <CheckoutModal 
                isOpen={showCheckout}
                onClose={() => setShowCheckout(false)}
                onSubmit={handleCheckoutSubmit}
                cartTotal={cartItems.reduce((s, it) => s + getRowTotal(it.product) * it.qty, 0)}
                cartItemsCount={cartItems.length}
              />
            </div>
          )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NewReservationModal;