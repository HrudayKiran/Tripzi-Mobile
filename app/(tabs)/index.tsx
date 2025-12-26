import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { useAuth } from '../../src/contexts/AuthContext';
import { Search, Bell } from 'lucide-react-native';
import { AdMobBanner } from 'expo-ads-admob';
import { BANNER_AD_UNIT_ID } from '../../src/lib/ads';

interface Trip {
  id: string;
  title: string;
  destination: string;
  cost: number;
  start_date: string;
  user_id: string;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrips = async () => {
    try {
      const tripsRef = collection(db, 'trips');
      const q = query(
        tripsRef, 
        where('status', '==', 'open'),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tripsData: Trip[] = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({ id: doc.id, ...doc.data() } as Trip);
      });

      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips();
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle}>{item.title}</Text>
        <Text style={styles.tripDestination}>{item.destination}</Text>
        <Text style={styles.tripCost}>₹{item.cost.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tripzi</Text>
        <TouchableOpacity>
          <Bell size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <Text style={styles.searchText}>Search trips, people, or places</Text>
      </View>

      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={BANNER_AD_UNIT_ID}
        servePersonalizedAds
        style={styles.bannerAd}
      />

      <FlatList
        data={trips}
        renderItem={renderTripItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    margin: 15,
    padding: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchText: {
    color: '#666',
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripInfo: {
    padding: 15,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripDestination: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tripCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

const styles_extra = StyleSheet.create({
  bannerAd: {
    alignSelf: 'center',
    marginVertical: 10,
  },
});
