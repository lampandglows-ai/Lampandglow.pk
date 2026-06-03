import { db, storage } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const heroBannersService = {
  getAllBanners: async () => {
    try {
      const q = query(collection(db, 'heroBanners'), orderBy('displayOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      const banners = [];
      querySnapshot.forEach((doc) => {
        banners.push({ id: doc.id, ...doc.data() });
      });
      return banners;
    } catch (error) {
      console.error('Error getting hero banners:', error);
      throw error;
    }
  },

  getActiveBanners: async () => {
    try {
      const q = query(collection(db, 'heroBanners'), orderBy('displayOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      const banners = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive) {
          banners.push({ id: doc.id, ...data });
        }
      });
      return banners;
    } catch (error) {
      console.error('Error getting active banners:', error);
      throw error;
    }
  },

  getBannerById: async (id) => {
    try {
      const docRef = doc(db, 'heroBanners', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Banner not found');
    } catch (error) {
      console.error('Error getting banner:', error);
      throw error;
    }
  },

  createBanner: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'heroBanners'), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  updateBanner: async (id, data) => {
    try {
      const docRef = doc(db, 'heroBanners', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  deleteBanner: async (id) => {
    try {
      await deleteDoc(doc(db, 'heroBanners', id));
      return { id };
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  uploadBannerImage: async (file) => {
    try {
      const storageRef = ref(storage, `heroBanners/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      console.error('Error uploading banner image:', error);
      throw error;
    }
  },
};

export default heroBannersService;
