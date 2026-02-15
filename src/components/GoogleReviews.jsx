import React, { useState } from 'react';
import { Star, Send, CheckCircle, User, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';
import '../styles/GoogleReviews.css';

const GoogleReviews = () => {
    const { t } = useLanguage();
    const { editMode } = useAdmin();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewData, setReviewData] = useState({
        name: '',
        email: '',
        comment: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Sample reviews - using state so they can be deleted in admin mode
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Excellent service! My iPhone screen was replaced quickly and professionally. Highly recommend!',
            date: '2026-02-10'
        },
        {
            id: 2,
            name: 'Michael Chen',
            rating: 5,
            comment: 'Very satisfied with the battery replacement on my Samsung. Great communication and fair pricing.',
            date: '2026-02-08'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            rating: 5,
            comment: 'Fast and reliable! They came to my location and fixed my tablet in under an hour. Amazing!',
            date: '2026-02-05'
        },
        {
            id: 4,
            name: 'David Thompson',
            rating: 4,
            comment: 'Good service overall. The repair was done well, though it took a bit longer than expected.',
            date: '2026-02-01'
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteReview = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setSubmitError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_KEY';

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    subject: `New ${rating}-Star Review from ${reviewData.name}`,
                    from_name: reviewData.name,
                    email: reviewData.email,
                    message: `
Rating: ${rating} Stars
Name: ${reviewData.name}
Email: ${reviewData.email}

Review:
${reviewData.comment}

---
Submitted on: ${new Date().toLocaleString()}
          `.trim()
                })
            });

            const result = await response.json();

            if (result.success) {
                setSubmitSuccess(true);
                setReviewData({ name: '', email: '', comment: '' });
                setRating(0);

                // Reset success message after 5 seconds
                setTimeout(() => {
                    setSubmitSuccess(false);
                }, 5000);
            } else {
                setSubmitError('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            setSubmitError('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (count, interactive = false) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <Star
                    key={index}
                    size={interactive ? 32 : 20}
                    className={`star ${starValue <= (interactive ? (hoverRating || rating) : count) ? 'filled' : ''}`}
                    onClick={interactive ? () => setRating(starValue) : undefined}
                    onMouseEnter={interactive ? () => setHoverRating(starValue) : undefined}
                    onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                />
            );
        });
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return '0.0';
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    return (
        <section className="google-reviews-section" id="reviews">
            <div className="container">
                <div className="reviews-header">
                    <h2 className="section-title">Customer Reviews</h2>
                    <p className="section-subtitle">See what our customers are saying about us</p>

                    <div className="rating-summary">
                        <div className="average-rating">
                            <span className="rating-number">{calculateAverageRating()}</span>
                            <div className="rating-stars">
                                {renderStars(Math.round(calculateAverageRating()))}
                            </div>
                            <span className="review-count">Based on {reviews.length} reviews</span>
                        </div>
                    </div>
                </div>

                <div className="reviews-content">
                    {/* Existing Reviews */}
                    <div className="reviews-list">
                        <h3 className="reviews-list-title">Recent Reviews</h3>
                        <div className="reviews-grid">
                            {reviews.length === 0 ? (
                                <div className="no-reviews">
                                    <p>No reviews yet. Be the first to leave a review!</p>
                                </div>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className={`review-card ${editMode ? 'admin-mode' : ''}`}>
                                        <div className="review-header">
                                            <div className="reviewer-info">
                                                <div className="reviewer-avatar">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="reviewer-name">{review.name}</h4>
                                                    <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                        {editMode && (
                                            <button
                                                className="delete-review-btn"
                                                onClick={() => handleDeleteReview(review.id)}
                                                title="Delete this review"
                                            >
                                                <Trash2 size={18} />
                                                Delete Review
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Review Submission Form */}
                    <div className="review-form-container">
                        <h3 className="form-title">Share Your Experience</h3>
                        <p className="form-subtitle">We'd love to hear about your experience with Mobilphonefix</p>

                        {submitSuccess && (
                            <div className="success-message">
                                <CheckCircle size={24} />
                                <p>Thank you for your review! We appreciate your feedback.</p>
                            </div>
                        )}

                        {submitError && (
                            <div className="error-message">
                                <p>{submitError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="review-form">
                            <div className="form-group">
                                <label htmlFor="rating">Your Rating *</label>
                                <div className="star-rating">
                                    {renderStars(rating, true)}
                                </div>
                                {rating > 0 && (
                                    <span className="rating-text">
                                        {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great!' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="name">Your Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={reviewData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your name"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Your Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={reviewData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="your.email@example.com"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="comment">Your Review *</label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={reviewData.comment}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell us about your experience..."
                                    rows="5"
                                    className="form-textarea"
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Submit Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GoogleReviews;
