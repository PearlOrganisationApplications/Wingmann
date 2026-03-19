import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Utensils, MapPin, Pizza, Banknote, X, Plus, Coffee, Camera, Trash2, Edit3, Check, Link as LinkIcon, Loader2, ExternalLink
} from 'lucide-react';
import { Input } from '../components/Shared/Input';
import { Button } from '../components/Shared/Button';
import { getAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../api/restaurantApi';

const Restaurants = () => {
  const fileInputRef = useRef(null);
  const ADMIN_ID = "699d6c888e41d29366bb2b50";
  const FOOD_TYPES = ['North Indian', 'South Indian', 'Italian', 'Chinese', 'Fast Food', 'Cafe', 'Bakery', 'Continental'];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);

  const [formData, setFormData] = useState({
    venue: 'restaurant',
    businessName: '',
    streetAddress: '',
    cityState: '',
    googleMapLink: '',
    typeOfFood: '',
    budgetPerPerson: '',
    photo: null
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const result = await getAllRestaurants();
      if (result.success) setRestaurantList(result.data || []);
    } catch (error) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleReset = () => {
    setFormData({
      venue: 'restaurant', businessName: '', streetAddress: '', cityState: '',
      googleMapLink: '', typeOfFood: '', budgetPerPerson: '', photo: null
    });
    setPreview(null);
    setEditId(null);
    setShowFoodDropdown(false);
  };

  const handleEditOpen = (item) => {
    setEditId(item._id);
    setFormData({
      venue: item.venue || 'restaurant',
      businessName: item.businessName || '',
      streetAddress: item.address?.streetAddress || '',
      cityState: item.address?.cityState || '',
      googleMapLink: item.address?.googleMapLink || '',
      typeOfFood: item.typeOfFood || '',
      budgetPerPerson: item.budgetPerPerson || '',
      photo: null
    });
    setPreview(item.photo);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.businessName.trim()) return toast.error("Business Name is required");

    setSaving(true);
    const data = new FormData();
    data.append('venue', formData.venue);
    data.append('businessName', formData.businessName);
    data.append('streetAddress', formData.streetAddress);
    data.append('cityState', formData.cityState);
    data.append('googleMapLink', formData.googleMapLink);
    data.append('typeOfFood', formData.typeOfFood);
    data.append('budgetPerPerson', formData.budgetPerPerson);
    data.append('uploadedBy', ADMIN_ID);

    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    try {
      const result = editId
        ? await updateRestaurant(editId, data)
        : await addRestaurant(data);

      if (result.success) {
        toast.success(editId ? "Updated!" : "Venue Added!");
        fetchRestaurants();
        setIsModalOpen(false);
        handleReset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await deleteRestaurant(id);
      toast.success("Deleted");
      fetchRestaurants();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 bg-white min-h-screen">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex justify-between items-end border-b border-slate-100 pb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Venue Partners</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Manage Locations</p>
        </div>
        <Button onClick={() => { handleReset(); setIsModalOpen(true); }} className="bg-black text-white px-8 py-4 rounded-xl text-xs font-bold uppercase shadow-lg">
          <Plus size={18} className="mr-2" /> Add Venue
        </Button>
      </div>

      {loading ? (
        <div className="py-32 flex justify-center"><Loader2 size={40} className="animate-spin text-slate-200" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurantList.map((rest) => (
            <div key={rest._id} className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden relative group hover:shadow-xl transition-all duration-500">
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button onClick={() => handleEditOpen(rest)} className="p-2.5 bg-white/90 backdrop-blur text-black rounded-xl border border-slate-100 hover:bg-black hover:text-white transition-all"><Edit3 size={16} /></button>
                <button onClick={() => handleDelete(rest._id)} className="p-2.5 bg-white/90 backdrop-blur text-red-600 rounded-xl border border-slate-100 hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16} /></button>
              </div>

              <div className="h-52 bg-slate-50 relative overflow-hidden">
                {rest.photo ? (
                  <img src={rest.photo} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200"><Utensils size={48} /></div>
                )}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">{rest.venue}</span>
                </div>
              </div>

              <div className="p-8">
                <h4 className="text-xl font-black text-slate-900 uppercase truncate mb-1">{rest.businessName}</h4>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-1 text-slate-400">
                    <MapPin size={12} />
                    <p className="text-[10px] font-bold uppercase tracking-wider truncate">{rest.address?.cityState || 'No address'}</p>
                  </div>

                  {/* GOOGLE MAPS LINK SHOWING HERE */}
                  {rest.address?.googleMapLink && (
                    <a
                      href={rest.address.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 transition-colors group/link"
                    >
                      <LinkIcon size={12} className="group-hover/link:rotate-12 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">View on Maps</span>
                      <ExternalLink size={10} className="opacity-50" />
                    </a>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-300 block mb-1">Cuisine</span>
                    <span className="text-xs font-bold text-slate-600 uppercase">{rest.typeOfFood}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-black text-slate-300 block mb-1">Budget</span>
                    <span className="text-lg font-black text-slate-900">₹{rest.budgetPerPerson}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Section remains exactly the same as your provided code */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
              <h3 className="text-slate-900 text-xl font-black uppercase tracking-widest">{editId ? 'Update Venue' : 'New Venue'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-2 rounded-full hover:bg-slate-100 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-10 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="flex gap-3">
                {['restaurant', 'cafe'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleChange('venue', type)}
                    className={`flex-1 py-4 px-6 rounded-2xl font-black transition-all border text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 ${formData.venue === type
                      ? 'bg-black border-black text-white shadow-lg'
                      : 'bg-white border-slate-100 text-slate-400'
                      }`}
                  >
                    {type === 'restaurant' ? <Utensils size={16} /> : <Coffee size={16} />}
                    {type}
                  </button>
                ))}
              </div>
              <div onClick={() => fileInputRef.current.click()} className="h-44 w-full rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex items-center justify-center cursor-pointer overflow-hidden relative group">
                {preview ? <img src={preview} className="w-full h-full object-cover" /> : <div className="text-center"><Camera className="mx-auto text-slate-300 mb-2" size={32} /><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload Venue Photo</p></div>}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Input label="BUSINESS NAME *" value={formData.businessName} onChange={(e) => handleChange('businessName', e.target.value)} />
                <Input label="STREET ADDRESS" value={formData.streetAddress} onChange={(e) => handleChange('streetAddress', e.target.value)} />
                <div className="flex gap-4">
                  <Input label="CITY, STATE" value={formData.cityState} onChange={(e) => handleChange('cityState', e.target.value)} />
                  <Input label="BUDGET / PERSON" type="number" value={formData.budgetPerPerson} onChange={(e) => handleChange('budgetPerPerson', e.target.value)} />
                </div>
                <Input label="GOOGLE MAPS URL" icon={LinkIcon} value={formData.googleMapLink} onChange={(e) => handleChange('googleMapLink', e.target.value)} />

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine Type</label>
                  <select
                    value={formData.typeOfFood}
                    onChange={(e) => handleChange('typeOfFood', e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:border-black transition-all"
                  >
                    <option value="">Select Category</option>
                    {FOOD_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 rounded-2xl border-slate-100 text-slate-400">Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="flex-2 bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : (editId ? 'Save Changes' : 'Confirm Partner')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;