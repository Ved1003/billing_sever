// routes/whatsapp.js

const express = require('express');
const router = express.Router();
const { generateInvoicePDFBuffer } = require('../utils/pdfGenerator'); // your PDF generator
const axios = require('axios');
const FormData = require('form-data');

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;

// POST /api/whatsapp/send-invoice
router.post('/send-invoice', async (req, res, next) => {
  try {
    const { invoiceId, toPhone } = req.body;
    if (!invoiceId || !toPhone) {
      return res.status(400).json({ error: 'invoiceId and toPhone are required' });
    }

    // 1) Generate the PDF buffer (in-memory). Implement this in utils/pdfGenerator.js
    const pdfBuffer = await generateInvoicePDFBuffer(invoiceId);

    // 2) Upload PDF to WhatsApp Media endpoint
    const mediaForm = new FormData();
    mediaForm.append('file', pdfBuffer, {
      filename: `invoice-${invoiceId}.pdf`,
      contentType: 'application/pdf',
    });
    mediaForm.append('messaging_product', 'whatsapp');

    const mediaResp = await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/media`,
      mediaForm,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          ...mediaForm.getHeaders(),
        },
      }
    );
    const mediaId = mediaResp.data.id;

    // 3) Send the document (PDF) as a WhatsApp message
    const msgResp = await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: toPhone, // E.164 format, e.g. "919812345678"
        type: 'document',
        document: {
          id: mediaId,
          filename: `invoice-${invoiceId}.pdf`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.json({ success: true, messageId: msgResp.data.messages[0].id });
  } catch (err) {
    console.error('WhatsApp send error:', err.response?.data || err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
