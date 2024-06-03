const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));

app.post('/track', async (req, res) => {
  try {
    const { vin, latitude, longitude } = req.body;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const location = { vin, latitude, longitude, timestamp };
    await db.collection('locations').add(location);
    res.status(201).send(location);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/track/:vin', async (req, res) => {
  try {
    const vin = req.params.vin;
    const snapshot = await db.collection('locations').where('vin', '==', vin).get();
    const locations = snapshot.docs.map(doc => doc.data());
    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
});

exports.api = functions.https.onRequest(app);
