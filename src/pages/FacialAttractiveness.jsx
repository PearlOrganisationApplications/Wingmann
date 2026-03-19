import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon, Trash2, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPhotos, uploadPhotos, deletePhoto, updatePhoto } from '../api/facialAttractivenessApi';

const FacialAttractiveness = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [actionId, setActionId] = useState(null); // Tracks which photo is being updated/deleted
    const [selectedGender, setSelectedGender] = useState('male');
    const [files, setFiles] = useState([]);

    // IDs exactly as shown in your Postman Screenshot
    const userId = "699e9a228e41d29366bb2dd0";
    const adminId = "69a2ab710e3189f17fba046e";

    const fetchData = async () => {
        try {
            const res = await getPhotos(userId);
            // Based on your response JSON, photos are in res.data.photos
            if (res.success) setPhotos(res.data.photos || []);
        } catch (err) {
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // UPDATE GENDER LOGIC
    const handleUpdateGender = async (photoId, currentGender) => {
        const newGender = currentGender === 'male' ? 'female' : 'male';
        setActionId(photoId);

        try {
            const res = await updatePhoto(adminId, photoId, newGender);
            if (res.success) {
                toast.success(`Moved to ${newGender} portfolio`);
                // Use the updated list from the API response
                setPhotos(res.data.photos);
            }
        } catch (err) {
            toast.error("Update failed: " + (err.response?.data?.message || "Check parameters"));
        } finally {
            setActionId(null);
        }
    };

    // DELETE LOGIC
    const handleDelete = (photoId) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-[#1F1F2E]">Confirm deletion?</p>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setActionId(photoId);
                            try {
                                const res = await deletePhoto(adminId, photoId);
                                if (res.success) {
                                    toast.success("Removed");
                                    setPhotos(prev => prev.filter(p => p._id !== photoId));
                                }
                            } catch (err) { toast.error("Delete failed"); }
                            setActionId(null);
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Cancel</button>
                </div>
            </div>
        ));
    };

    // UPLOAD LOGIC
    const handleUpload = async (e) => {
        e.preventDefault();
        if (files.length === 0) return toast.error("Select photos first");
        setUploading(true);
        const formData = new FormData();
        formData.append('gender', selectedGender);
        files.forEach(file => formData.append('photos', file));

        try {
            const res = await uploadPhotos(userId, formData);
            if (res.success) {
                toast.success("Uploaded successfully");
                setPhotos(res.data.photos);
                setFiles([]);
            }
        } catch (err) { toast.error("Upload failed"); } finally { setUploading(false); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-4">
            {/* Header / Upload Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#1F1F2E] tracking-tighter">Facial Attractiveness</h2>
                    <p className="text-sm text-slate-400 font-medium">Manage and move model assets</p>
                </div>
                <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-3 bg-[#F8FAFC] p-2 rounded-3xl border border-slate-200">
                    <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)} className="bg-white border border-slate-200 rounded-xl text-xs font-bold px-4 h-12 uppercase">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <label className="flex items-center gap-3 cursor-pointer px-6 h-12 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                        <Upload size={16} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase text-slate-600">
                            {files.length > 0 ? `${files.length} Selected` : "Add Photos"}
                        </span>
                        <input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files))} accept="image/*" />
                    </label>
                    <button type="submit" disabled={uploading} className="bg-[#1F1F2E] text-white px-8 h-12 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : "Upload"}
                    </button>
                </form>
            </div>

            {/* Portfolios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-2 py-32 flex justify-center"><Loader2 size={40} className="animate-spin text-slate-200" /></div>
                ) : (
                    <>
                        <PortfolioBlock
                            title="Men's Portfolio"
                            photos={photos.filter(p => p.gender === 'male')}
                            onUpdate={handleUpdateGender}
                            onDelete={handleDelete}
                            actionId={actionId}
                        />
                        <PortfolioBlock
                            title="Women's Portfolio"
                            photos={photos.filter(p => p.gender === 'female')}
                            onUpdate={handleUpdateGender}
                            onDelete={handleDelete}
                            actionId={actionId}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

// Reusable Grid Component
const PortfolioBlock = ({ title, photos, onUpdate, onDelete, actionId }) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-[#1F1F2E]">{title}</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold uppercase">{photos.length} Photos</span>
        </div>

        {photos.length === 0 ? (
            <div className="py-20 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center">
                <ImageIcon size={32} className="text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm">No photos</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo) => (
                    <div key={photo._id} className="group relative aspect-3/4 rounded-2xl overflow-hidden bg-slate-100">
                        <img src={photo.imgUrl} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => onUpdate(photo._id, photo.gender)} className="p-2 bg-white/20 hover:bg-indigo-500 backdrop-blur-md text-white rounded-xl transition-all">
                                    {actionId === photo._id ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                                </button>
                                <button onClick={() => onDelete(photo._id)} className="p-2 bg-white/20 hover:bg-red-500 backdrop-blur-md text-white rounded-xl transition-all">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <span className="text-[9px] text-white font-bold uppercase tracking-widest px-2 py-1 bg-black/20 rounded w-fit">{photo.gender}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default FacialAttractiveness;