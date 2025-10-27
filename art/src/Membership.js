import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './Membership.css';

const Membership = () => {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      badge: '🌟 Perfect Start',
      description: 'Perfect for beginners and personal projects',
      features: [
        '10 AI transformations/month',
        '5+ Basic AI styles',
        'Standard quality exports',
        'Community support',
        'Basic gallery storage'
      ],
      limitations: [
        'Watermarked outputs',
        'Standard processing speed',
        'Limited style options'
      ],
      popular: false,
      current: user?.membership === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 19, annual: 152 },
      badge: '💎 Most Popular',
      description: 'Unlimited creativity for serious artists & creators',
      features: [
        '🚀 UNLIMITED transformations',
        '25+ Premium AI styles',
        '4K HD quality exports',
        'Batch processing (up to 10)',
        'Priority support',
        'Advanced editing tools',
        'No watermarks',
        'Custom style training',
        'API access (basic)'
      ],
      limitations: [],
      popular: true,
      current: user?.membership === 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 99, annual: 950 },
      badge: '🏢 Business Solution',
      description: 'Complete solution for teams, agencies & businesses',
      features: [
        '✨ Everything in Pro +',
        'Custom AI model training',
        'Full API access & integrations',
        'Team collaboration (up to 25)',
        'Dedicated account manager',
        'White-label solutions',
        'Priority processing',
        'Advanced analytics',
        'Custom integrations',
        'SLA guarantee'
      ],
      limitations: [],
      popular: false,
      current: user?.membership === 'enterprise'
    }
  ];

  const currentPlan = plans.find(plan => plan.current);
  const usageData = {
    transformations: { used: 42, limit: currentPlan?.id === 'free' ? 10 : 'Unlimited' },
    storage: { used: 2.5, limit: currentPlan?.id === 'free' ? 5 : 'Unlimited' },
    styles: { used: 8, limit: currentPlan?.id === 'free' ? 5 : 25 }
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    const amount = billingPeriod === 'annual' ? price : price;
    return `$${amount}`;
  };

  const calculateSavings = (plan) => {
    if (plan.price.monthly === 0) return null;
    const monthlyTotal = plan.price.monthly * 12;
    const savings = monthlyTotal - plan.price.annual;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  if (!user) {
    return (
      <div className="membership-container">
        <div className="membership-error">
          <h2>Please log in to view membership details</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="membership-container">
      <div className="membership-header">
        <h1 className="membership-title">Membership & Billing</h1>
        <p className="membership-subtitle">Manage your subscription and billing preferences</p>
      </div>

      {/* Current Plan Overview */}
      <div className="current-plan-section">
        <div className="current-plan-card">
          <div className="plan-header">
            <div className="plan-info">
              <h2 className="current-plan-title">Current Plan</h2>
              <div className="plan-name-badge">
                <span className="plan-name">{currentPlan?.name}</span>
                <span className="plan-badge">{currentPlan?.badge}</span>
              </div>
              <p className="plan-description">{currentPlan?.description}</p>
            </div>
            
            <div className="plan-pricing">
              <div className="current-price">
                <span className="price-amount">{formatPrice(currentPlan?.price[billingPeriod])}</span>
                {currentPlan?.price.monthly > 0 && (
                  <span className="price-period">/{billingPeriod === 'annual' ? 'year' : 'month'}</span>
                )}
              </div>
              {currentPlan?.id !== 'free' && (
                <div className="next-billing">
                  Next billing: March 15, 2024
                </div>
              )}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="usage-stats">
            <h3 className="usage-title">Usage This Month</h3>
            <div className="usage-grid">
              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">Transformations</span>
                  <span className="usage-count">
                    {usageData.transformations.used}
                    {usageData.transformations.limit !== 'Unlimited' && `/${usageData.transformations.limit}`}
                  </span>
                </div>
                {usageData.transformations.limit !== 'Unlimited' && (
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(usageData.transformations.used / usageData.transformations.limit) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">Storage</span>
                  <span className="usage-count">
                    {usageData.storage.used}GB
                    {usageData.storage.limit !== 'Unlimited' && `/${usageData.storage.limit}GB`}
                  </span>
                </div>
                {usageData.storage.limit !== 'Unlimited' && (
                  <div className="usage-bar">
                    <div 
                      className="usage-fill" 
                      style={{ width: `${(usageData.storage.used / usageData.storage.limit) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="usage-item">
                <div className="usage-header">
                  <span className="usage-label">AI Styles Used</span>
                  <span className="usage-count">{usageData.styles.used}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Period Toggle */}
      <div className="billing-toggle-section">
        <div className="billing-toggle">
          <span className={`toggle-option ${billingPeriod === 'monthly' ? 'active' : ''}`}>
            Monthly
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={billingPeriod === 'annual'}
              onChange={(e) => setBillingPeriod(e.target.checked ? 'annual' : 'monthly')}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className={`toggle-option ${billingPeriod === 'annual' ? 'active' : ''}`}>
            Annual
            <span className="savings-badge">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Available Plans */}
      <div className="plans-section">
        <h2 className="plans-title">Available Plans</h2>
        <div className="plans-grid">
          {plans.map(plan => {
            const savings = calculateSavings(plan);
            
            return (
              <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${plan.current ? 'current' : ''}`}>
                {plan.popular && <div className="popular-badge">🔥 MOST POPULAR</div>}
                {plan.current && <div className="current-badge">✅ CURRENT PLAN</div>}
                
                <div className="plan-card-header">
                  <div className="plan-badge-small">{plan.badge}</div>
                  <h3 className="plan-title">{plan.name}</h3>
                  
                  <div className="plan-price-section">
                    <div className="plan-price">
                      <span className="price-currency">$</span>
                      <span className="price-amount">{plan.price[billingPeriod]}</span>
                      {plan.price.monthly > 0 && (
                        <span className="price-period">/{billingPeriod === 'annual' ? 'year' : 'month'}</span>
                      )}
                    </div>
                    
                    {billingPeriod === 'annual' && savings && (
                      <div className="savings-info">
                        Save ${savings.amount}/year ({savings.percentage}% off)
                      </div>
                    )}
                  </div>
                  
                  <p className="plan-description-small">{plan.description}</p>
                </div>

                <div className="plan-features">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="limitations">
                      <div className="limitations-title">Limitations:</div>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="limitation-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          <span>{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="plan-action">
                  {plan.current ? (
                    <button className="plan-button current-button" disabled>
                      Current Plan
                    </button>
                  ) : plan.id === 'enterprise' ? (
                    <button className="plan-button contact-button">
                      Contact Sales
                    </button>
                  ) : (
                    <button className="plan-button upgrade-button">
                      {currentPlan?.id === 'free' ? 'Upgrade Now' : 'Switch Plan'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="billing-history-section">
        <h2 className="section-title">Billing History</h2>
        <div className="billing-table">
          <div className="table-header">
            <span>Date</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          
          <div className="table-row">
            <span>Feb 15, 2024</span>
            <span>Pro Monthly Subscription</span>
            <span>$19.00</span>
            <span className="status paid">Paid</span>
            <span>
              <button className="action-link">Download</button>
            </span>
          </div>
          
          <div className="table-row">
            <span>Jan 15, 2024</span>
            <span>Pro Monthly Subscription</span>
            <span>$19.00</span>
            <span className="status paid">Paid</span>
            <span>
              <button className="action-link">Download</button>
            </span>
          </div>
          
          <div className="table-row">
            <span>Dec 15, 2023</span>
            <span>Pro Monthly Subscription</span>
            <span>$19.00</span>
            <span className="status paid">Paid</span>
            <span>
              <button className="action-link">Download</button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;