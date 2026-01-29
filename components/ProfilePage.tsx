
import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ArrowLeft, Edit3, Save, Loader2, Camera, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { UserType } from '../types';
import { getUserProfile } from '../services/userService';
import ConfirmationModal from './ConfirmationModal';

interface ProfilePageProps {
  user: any; 
  userType: UserType | null; 
  onUpdateProfile: (data: any) => Promise<void>; 
  // Fix: Broaden onSwitchRole type to UserType for consistency with userType state in App.tsx
  onSwitchRole: (targetRole: UserType) => Promise<void>; 
  onDeleteProfile: () => Promise<void>; 
  onBack: () => void; 
  onLogout: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, userType, onUpdateProfile, onDeleteProfile, onBack, onLogout }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({ name: '', avatar_url: '' });

  useEffect(() => {
    const fetch = async () => {
      if (!user?.id) { setIsLoadingProfile(false); return; }
      try { 
        const data = await getUserProfile(user.id); 
        if (data) { 
          setDbProfile(data); 
          setEditData({ 
            name: data.full_name || '', 
            avatar_url: data.avatar_url || '' 
          }); 
        } 
      } finally { 
        setIsLoadingProfile(false); 
      }
    };
    fetch();
  }, [user?.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { full_name: editData.name, avatar_url: editData.avatar_url };
      await onUpdateProfile(payload); 
      setDbProfile(prev => ({ ...prev, ...payload })); 
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black font-bold text-[10px] uppercase tracking-widest transition-colors"><ArrowLeft size={16} /> {t('common.back')}</button>
        <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isSaving} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg ${isEditing ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-black text-white hover:bg-gray-800'}`}>
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <Save size={14} /> : <Edit3 size={14} />} {isEditing ? t('profile.save') : t('profile.edit')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="apple-card p-8 border border-gray-100 bg-white text-center shadow-sm">
          <div className="w-24 h-24 rounded-[32px] overflow-hidden shadow-xl bg-gray-100 mx-auto mb-6 relative group">
            {editData.avatar_url ? <img src={editData.avatar_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-indigo-400"><User size={40} /></div>}
            {isEditing && <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={20} /></button>}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setEditData({...editData, avatar_url: r.result as string}); r.readAsDataURL(f); } }} />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-1">{isEditing ? <input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full text-center bg-gray-50 border border-gray-100 rounded-xl p-2 outline-none font-bold" /> : editData.name}</h2>
          <p className="text-xs text-gray-400 mb-6 font-bold">{user?.email}</p>
          <div className="flex flex-col gap-2">
            {!dbProfile?.role_selected ? (
              <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-gray-200">{t('profile.roleNotSelected')}</div>
            ) : dbProfile?.is_pro ? (
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-emerald-100">{t('profile.proProfile')}</div>
            ) : (
              <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-indigo-100">{t('profile.expatProfile')}</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="apple-card p-8 border border-gray-100 bg-white space-y-8 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{t('profile.personalDetails')}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">{t('profile.joinedOn')}</div>
                <div className="text-sm font-black text-gray-900">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : t('common.na')}</div>
              </div>
            </div>
          </div>
          <div className="apple-card p-8 border border-red-100 bg-red-50/20 shadow-sm">
            <div className="flex items-center gap-3 mb-4"><AlertTriangle size={20} className="text-red-500" /><h3 className="text-sm font-black uppercase text-red-600 tracking-wider">{t('profile.dangerZone')}</h3></div>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">{t('profile.deleteAccount')}</p>
            <button onClick={() => setShowDeleteConfirm(true)} className="px-6 py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl text-[11px] font-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm active:scale-95">
              {t('profile.deleteBtn')}
            </button>
          </div>
          <div className="pt-8 flex justify-center"><button onClick={onLogout} className="flex items-center gap-2 text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors tracking-widest"><LogOut size={16} /> {t('nav.logout')}</button></div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        onConfirm={onDeleteProfile} 
        title={t('profile.deleteConfirmTitle')} 
        message={userType === 'pro' ? t('profile.deleteConfirmMessagePro') : t('profile.deleteConfirmMessageExpat')} 
        confirmLabel={t('profile.deleteBtn')} 
        type="expat" 
        requireTextConfirmation="delete" 
      />
    </div>
  );
};

export default ProfilePage;
