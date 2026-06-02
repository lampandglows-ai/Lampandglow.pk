import { db } from './firebase';
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
  where,
} from 'firebase/firestore';

export const announcementService = {
  getAllAnnouncements: async () => {
    try {
      const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const announcements = [];
      querySnapshot.forEach((doc) => {
        announcements.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return announcements;
    } catch (error) {
      console.error('Error getting announcements:', error);
      throw error;
    }
  },

  getActiveAnnouncement: async () => {
    try {
      const q = query(
        collection(db, 'announcements'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting active announcement:', error);
      throw error;
    }
  },

  getAnnouncementById: async (id) => {
    try {
      const docRef = doc(db, 'announcements', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      throw new Error('Announcement not found');
    } catch (error) {
      console.error('Error getting announcement:', error);
      throw error;
    }
  },

  createAnnouncement: async (data) => {
    try {
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  updateAnnouncement: async (id, data) => {
    try {
      const docRef = doc(db, 'announcements', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return { id, ...data };
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
      return { id };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },
};

export default announcementService;
