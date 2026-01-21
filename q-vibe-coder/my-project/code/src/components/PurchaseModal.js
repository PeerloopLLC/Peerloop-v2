import React, { useState } from 'react';
import { FaTimes, FaLock, FaCreditCard, FaCheck } from 'react-icons/fa';

/**
 * PurchaseModal - Payment flow for "Purchase Course Now, Schedule Later"
 * Shows course info, payment form, and handles purchase completion
 */
const PurchaseModal = ({
  course,
  instructor,
  isDarkMode = true,
  onClose,
  onPurchaseComplete
}) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/27');
  const [cvc, setCvc] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  // Colors
  const bgPrimary = isDarkMode ? '#000' : '#fff';
  const bgSecondary = isDarkMode ? '#16181c' : '#f8fafc';
  const textPrimary = isDarkMode ? '#e7e9ea' : '#0f172a';
  const textSecondary = isDarkMode ? '#71767b' : '#64748b';
  const borderColor = isDarkMode ? '#2f3336' : '#e2e8f0';
  const inputBg = isDarkMode ? '#1a1a1a' : '#f1f5f9';

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry as MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  // Get price as number for display
  const getPrice = () => {
    if (!course?.price) return '$49';
    // Price might be stored as "$299" or "299" or 299
    const priceStr = String(course.price);
    if (priceStr.startsWith('$')) return priceStr;
    return `$${priceStr}`;
  };

  const handlePay = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsProcessing(false);
    setPurchaseComplete(true);
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length >= 15 &&
                      expiry.length >= 5 &&
                      cvc.length >= 3;

  // Success screen after purchase
  if (purchaseComplete) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10001,
        padding: 20
      }}>
        <div style={{
          background: bgPrimary,
          borderRadius: 16,
          width: '100%',
          maxWidth: 380,
          padding: 32,
          textAlign: 'center',
          border: `1px solid ${borderColor}`
        }}>
          {/* Success Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <FaCheck size={28} color="#fff" />
          </div>

          <h3 style={{
            fontSize: 20,
            fontWeight: 700,
            color: textPrimary,
            margin: '0 0 8px'
          }}>
            Purchase Complete!
          </h3>

          <p style={{
            fontSize: 14,
            color: textSecondary,
            margin: '0 0 24px',
            lineHeight: 1.5
          }}>
            <strong style={{ color: textPrimary }}>{course?.title}</strong>
            <br />
            is now in your courses
          </p>

          {/* Go to My Courses */}
          <button
            onClick={() => onPurchaseComplete('my-courses')}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 12
            }}
          >
            Go to My Courses
          </button>

          {/* Schedule a Session */}
          <button
            onClick={() => onPurchaseComplete('schedule')}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 10,
              border: `1px solid ${borderColor}`,
              background: 'transparent',
              color: textPrimary,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Schedule a Session
          </button>
        </div>
      </div>
    );
  }

  // Payment form
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10001,
      padding: 20
    }}>
      <div style={{
        background: bgPrimary,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        maxHeight: '90vh',
        overflow: 'auto',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          padding: '20px 24px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff'
            }}
          >
            <FaTimes size={14} />
          </button>
          <h3 style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            margin: 0
          }}>
            Complete Your Purchase
          </h3>
        </div>

        {/* Course Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}>
            {course?.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: 24 }}>📚</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{
              fontSize: 15,
              fontWeight: 600,
              color: textPrimary,
              margin: 0,
              marginBottom: 4
            }}>
              {course?.title || 'Course'}
            </h4>
            <p style={{
              fontSize: 13,
              color: textSecondary,
              margin: 0
            }}>
              by {instructor?.name || 'Instructor'}
            </p>
            <p style={{
              fontSize: 12,
              color: textSecondary,
              margin: '4px 0 0'
            }}>
              Instant access to all course content
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ padding: '20px 24px' }}>
          <h4 style={{
            fontSize: 14,
            fontWeight: 600,
            color: textPrimary,
            margin: '0 0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <FaCreditCard size={14} />
            Payment Details
          </h4>

          {/* Card Number */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12,
              fontWeight: 500,
              color: textSecondary,
              display: 'block',
              marginBottom: 6
            }}>
              Card Number
            </label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 8,
                border: `1px solid ${borderColor}`,
                background: inputBg,
                color: textPrimary,
                fontSize: 15,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Expiry & CVC */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 500,
                color: textSecondary,
                display: 'block',
                marginBottom: 6
              }}>
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                fontSize: 12,
                fontWeight: 500,
                color: textSecondary,
                display: 'block',
                marginBottom: 6
              }}>
                CVC
              </label>
              <input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textPrimary,
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Price Summary */}
          <div style={{
            borderTop: `1px solid ${borderColor}`,
            paddingTop: 16,
            marginBottom: 20
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 8
            }}>
              <span style={{ fontSize: 14, color: textSecondary }}>Course Price</span>
              <span style={{ fontSize: 14, color: textPrimary }}>{getPrice()}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 8,
              borderTop: `1px solid ${borderColor}`
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>Total</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: textPrimary }}>{getPrice()}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={!isFormValid || isProcessing}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 10,
              border: 'none',
              background: isFormValid && !isProcessing
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : isDarkMode ? '#333' : '#e2e8f0',
              color: isFormValid && !isProcessing ? '#fff' : textSecondary,
              fontSize: 16,
              fontWeight: 600,
              cursor: isFormValid && !isProcessing ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <FaCreditCard size={16} />
                Pay {getPrice()}
              </>
            )}
          </button>

          {/* Secure Payment Note */}
          <p style={{
            fontSize: 12,
            color: textSecondary,
            textAlign: 'center',
            margin: '12px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}>
            <FaLock size={10} />
            Secure payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;
