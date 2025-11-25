import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LOIBuilder({ price = 0, unitCount = 0, address = '', noi = 0, propertyId = null, sellerId = null, onClose = null }) {
  const [step, setStep] = useState(1);
  
  // Step 1: Deal Snapshot
  const [purchasePrice, setPurchasePrice] = useState(price);
  const [units, setUnits] = useState(unitCount);
  const [currentNOI, setCurrentNOI] = useState(noi);
  const [closingTimeline, setClosingTimeline] = useState(45);
  const [ddPeriod, setDdPeriod] = useState(30);
  const [earnestMoney, setEarnestMoney] = useState(10000);
  const [earnestType, setEarnestType] = useState('refundable');
  
  // Step 2: Strategy
  const [strategy, setStrategy] = useState('');
  
  // Step 3: Terms (different per strategy)
  const [bankLTV, setBankLTV] = useState(75);
  const [bankRate, setBankRate] = useState(6.5);
  const [bankAmort, setBankAmort] = useState(25);
  const [sellerCarryAmount, setSellerCarryAmount] = useState(20);
  const [sellerRate, setSellerRate] = useState(5);
  const [sellerIO, setSellerIO] = useState(12);
  const [sellerAmort, setSellerAmort] = useState(20);
  const [sellerBalloon, setSellerBalloon] = useState(5);
  const [buyerCash, setBuyerCash] = useState(5);
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerEquity, setPartnerEquity] = useState(0);
  
  const [downPayment, setDownPayment] = useState(20);
  const [fullSellerRate, setFullSellerRate] = useState(5);
  const [fullSellerAmort, setFullSellerAmort] = useState(25);
  const [fullSellerIO, setFullSellerIO] = useState(0);
  const [fullSellerBalloon, setFullSellerBalloon] = useState(10);
  
  const [partnerDownPercent, setPartnerDownPercent] = useState(25);
  const [buyerContribution, setBuyerContribution] = useState(5);
  const [partnerShare, setPartnerShare] = useState(30);
  const [preferredReturn, setPreferredReturn] = useState(8);
  const [buyoutTrigger, setBuyoutTrigger] = useState('refi');
  const [buyoutMethod, setBuyoutMethod] = useState('appraisal');
  
  const [existingBalance, setExistingBalance] = useState(0);
  const [existingRate, setExistingRate] = useState(0);
  const [existingPayment, setExistingPayment] = useState(0);
  const [existingTerm, setExistingTerm] = useState(0);
  const [gapAmount, setGapAmount] = useState(0);
  const [gapRate, setGapRate] = useState(0);
  const [gapIO, setGapIO] = useState(0);
  const [gapBalloon, setGapBalloon] = useState(0);
  
  const [leasePayment, setLeasePayment] = useState(0);
  const [leaseTerm, setLeaseTerm] = useState(3);
  const [optionPrice, setOptionPrice] = useState(0);
  const [optionTerm, setOptionTerm] = useState(3);
  const [optionCredit, setOptionCredit] = useState(false);
  const [creditAmount, setCreditAmount] = useState(0);

  // Additional strategy states
  const [paymentDelayMonths, setPaymentDelayMonths] = useState(6);
  const [performanceBasePrice, setPerformanceBasePrice] = useState(0);
  const [performanceBonusAmount, setPerformanceBonusAmount] = useState(0);
  const [performanceTargetNOI, setPerformanceTargetNOI] = useState(0);
  const [equityParticipationPercent, setEquityParticipationPercent] = useState(10);
  const [deferredDownPercent, setDeferredDownPercent] = useState(15);
  const [deferredDownYears, setDeferredDownYears] = useState(3);
  const [cashDiscountPercent, setCashDiscountPercent] = useState(10);

  const strategies = [
    { 
      id: 'seller-carry-2nd', 
      label: '🎯 Seller Carry 2nd as Down Payment',
      badge: 'CREATIVE',
      description: 'Get 80% bank loan. Seller carries 20% 2nd mortgage interest-only for 5 years, then balloon. You bring $0 down.'
    },
    { 
      id: 'payment-delay', 
      label: '⏰ Payment Delay for Rent-Up Period',
      badge: 'VALUE-ADD',
      description: 'No payments for 6 months while you stabilize occupancy and increase rents. Perfect for properties at 60-70% occupancy.'
    },
    { 
      id: 'master-lease', 
      label: '🏗️ Master Lease with Purchase Option',
      badge: 'LOW RISK',
      description: 'Lease for covering seller\'s debt with option to buy within 3 years. 50% of lease payments credit toward purchase.'
    },
    { 
      id: 'subject-to', 
      label: '🔗 Subject-To + Seller Note for Equity Gap',
      badge: 'CREATIVE',
      description: 'Take over existing loan subject-to. Seller carries equity gap at 5% interest-only for 5 years. Close with $0 down.'
    },
    { 
      id: 'performance-based', 
      label: '📊 Performance-Based Price Adjustment',
      badge: 'WIN-WIN',
      description: 'Base price if NOI stays flat. Seller gets additional payment if you increase NOI. Seller gets upside, you prove performance first.'
    },
    { 
      id: 'equity-participation', 
      label: '💰 Seller Financing + Equity Participation',
      badge: 'CREATIVE',
      description: 'Purchase with 100% seller financing. Seller gets 10% of profits when you refinance or sell. Lower entry price.'
    },
    { 
      id: 'deferred-down', 
      label: '🏦 Hybrid: Bank Loan + Deferred Down Payment',
      badge: 'BANKABLE',
      description: 'Get 75% bank financing. Pay 10% down now, defer remaining 15% as seller note payable in Year 3 from refi proceeds.'
    },
    { 
      id: 'traditional-seller', 
      label: '📝 Traditional Seller Financing',
      badge: 'STANDARD',
      description: 'Purchase with 20-25% down. Seller carries note at 5-7% interest over 20-30 years. No bank approval needed.'
    },
    { 
      id: 'cash-offer', 
      label: '💵 Cash Offer',
      badge: 'SIMPLE',
      description: 'All-cash purchase at discount for quick close. Close in 7-14 days, no financing contingency.'
    }
  ];

  const generateLOI = () => {
    let text = `LETTER OF INTENT\n\n`;
    text += `Property: ${address}\n`;
    text += `Units: ${units}\n`;
    text += `Purchase Price: $${purchasePrice.toLocaleString()}\n`;
    
    // Calculate metrics
    const capRate = purchasePrice > 0 ? ((currentNOI / purchasePrice) * 100).toFixed(2) : 0;
    const monthlyCashFlow = (currentNOI / 12).toFixed(0);
    
    text += `Current NOI: $${currentNOI.toLocaleString()}\n`;
    text += `Cap Rate: ${capRate}%\n`;
    text += `Monthly Cash Flow: $${monthlyCashFlow}\n\n`;
    
    text += `Buyer Entity: [Buyer Entity Name]\n\n`;
    text += `TERMS:\n\n`;
    text += `Earnest Money: $${earnestMoney.toLocaleString()} (${earnestType})\n`;
    text += `Due Diligence Period: ${ddPeriod} days\n`;
    text += `Closing Timeline: ${closingTimeline} days from acceptance\n\n`;
    text += `FINANCING STRUCTURE:\n\n`;

    if (strategy === 'seller-carry-2nd') {
      // 🎯 Seller Carry 2nd as Down Payment (CREATIVE)
      const bankLoan = purchasePrice * 0.80;
      const sellerSecond = purchasePrice * 0.20;
      
      text += `🎯 SELLER CARRY 2ND AS DOWN PAYMENT (CREATIVE)\n\n`;
      text += `Bank Loan (1st Position): 80% LTV ($${bankLoan.toLocaleString()}) at ${bankRate}% interest, ${bankAmort}-year amortization\n`;
      text += `Seller Carry Second (2nd Position): 20% ($${sellerSecond.toLocaleString()}) at ${sellerRate}% interest\n`;
      text += `  - Interest-Only Period: ${sellerIO} months\n`;
      text += `  - Amortization: ${sellerAmort} years\n`;
      text += `  - Balloon: ${sellerBalloon} years\n`;
      text += `Buyer Cash Down: $0 (Seller carries the down payment)\n\n`;
      text += `This creative structure allows the buyer to acquire with no money down by having the seller carry the traditional 20% down payment as a subordinated second mortgage.\n`;
      
      // Calculate monthly payments
      const bankMonthlyRate = (bankRate / 100) / 12;
      const bankNumPayments = bankAmort * 12;
      const bankMonthlyPayment = bankLoan * (bankMonthlyRate * Math.pow(1 + bankMonthlyRate, bankNumPayments)) / (Math.pow(1 + bankMonthlyRate, bankNumPayments) - 1);
      const sellerMonthlyIO = (sellerSecond * (sellerRate / 100)) / 12;
      
      text += `\nMONTHLY DEBT SERVICE:\n`;
      text += `Bank Payment (1st): $${bankMonthlyPayment.toFixed(0)}\n`;
      text += `Seller Note (2nd, I/O): $${sellerMonthlyIO.toFixed(0)}\n`;
      text += `Total Monthly Debt: $${(bankMonthlyPayment + sellerMonthlyIO).toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt: $${(monthlyCashFlow - bankMonthlyPayment - sellerMonthlyIO).toFixed(0)}\n`;
      
    } else if (strategy === 'payment-delay') {
      // ⏰ Payment Delay for Rent-Up Period (VALUE-ADD)
      const downPaymentAmount = purchasePrice * (downPayment / 100);
      const financed = purchasePrice - downPaymentAmount;
      
      text += `⏰ PAYMENT DELAY FOR RENT-UP PERIOD (VALUE-ADD)\n\n`;
      text += `Down Payment: ${downPayment}% ($${downPaymentAmount.toLocaleString()})\n`;
      text += `Financed Amount: $${financed.toLocaleString()}\n`;
      text += `Payment Delay Period: ${paymentDelayMonths} months (no payments during rent-up)\n`;
      text += `Interest Rate: ${fullSellerRate}% (interest accrues but no payments due during delay)\n`;
      text += `Amortization: ${fullSellerAmort} years\n`;
      text += `Interest-Only Period: ${fullSellerIO} months (after delay period)\n`;
      text += `Balloon Term: ${fullSellerBalloon} years\n\n`;
      text += `This structure gives the buyer ${paymentDelayMonths} months to stabilize occupancy and increase rents before payments begin, allowing time to execute the value-add business plan.\n`;
      
      const accruedInterest = financed * (fullSellerRate / 100) * (paymentDelayMonths / 12);
      const newBalance = financed + accruedInterest;
      const monthlyIO = (newBalance * (fullSellerRate / 100)) / 12;
      const monthlyRate = (fullSellerRate / 100) / 12;
      const numPayments = fullSellerAmort * 12;
      const monthlyAmort = newBalance * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      text += `\nACCRUED INTEREST & PAYMENTS:\n`;
      text += `Interest Accrued During ${paymentDelayMonths}-Month Delay: $${accruedInterest.toFixed(0)}\n`;
      text += `New Balance (after accrual): $${newBalance.toFixed(0)}\n`;
      text += `Interest-Only Payment (months ${paymentDelayMonths + 1}-${paymentDelayMonths + fullSellerIO}): $${monthlyIO.toFixed(0)}\n`;
      text += `Amortized Payment (after I/O period): $${monthlyAmort.toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt (I/O period): $${(monthlyCashFlow - monthlyIO).toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt (amortized): $${(monthlyCashFlow - monthlyAmort).toFixed(0)}\n`;
      
    } else if (strategy === 'master-lease') {
      // 🏗️ Master Lease with Purchase Option (LOW RISK)
      text += `🏗️ MASTER LEASE WITH PURCHASE OPTION (LOW RISK)\n\n`;
      text += `Master Lease:\n`;
      text += `  - Monthly Payment to Seller: $${leasePayment.toLocaleString()}\n`;
      text += `  - Lease Term: ${leaseTerm} years\n`;
      text += `Option to Purchase:\n`;
      text += `  - Purchase Price: $${optionPrice.toLocaleString()}\n`;
      text += `  - Option Term: ${optionTerm} years\n`;
      if (optionCredit) text += `  - Credit Toward Purchase: $${creditAmount.toLocaleString()} of lease payments credited at closing\n`;
      text += `\nThis low-risk structure allows the buyer to control and operate the property while building equity through lease credits, with the option to purchase once performance is proven.\n`;
      
      text += `\nCASH FLOW:\n`;
      text += `Property NOI: $${monthlyCashFlow}/month\n`;
      text += `Lease Payment: $${leasePayment.toLocaleString()}/month\n`;
      text += `Net Operating Cash Flow: $${(monthlyCashFlow - leasePayment).toFixed(0)}/month\n`;
      if (optionCredit) {
        const totalCredit = creditAmount * leaseTerm * 12;
        text += `Total Lease Credits Over ${leaseTerm} Years: $${totalCredit.toLocaleString()}\n`;
      }
      
    } else if (strategy === 'subject-to') {
      // 🔗 Subject-To + Seller Note for Equity Gap (CREATIVE)
      const gap = purchasePrice - existingBalance;
      
      text += `🔗 SUBJECT-TO + SELLER NOTE FOR EQUITY GAP (CREATIVE)\n\n`;
      text += `Assume Existing Loan (Subject-To):\n`;
      text += `  - Balance: $${existingBalance.toLocaleString()}\n`;
      text += `  - Rate: ${existingRate}%\n`;
      text += `  - Monthly Payment: $${existingPayment.toLocaleString()}\n`;
      text += `  - Remaining Term: ${existingTerm} years\n`;
      text += `Equity Gap to Purchase Price: $${gap.toLocaleString()}\n`;
      text += `Seller Note for Gap: $${gapAmount.toLocaleString()} at ${gapRate}% interest\n`;
      text += `  - Interest-Only Period: ${gapIO} months\n`;
      text += `  - Balloon: ${gapBalloon} years\n\n`;
      text += `The buyer takes over the existing mortgage payments "subject-to" the existing financing, with the seller carrying a note for the equity gap. This avoids loan origination costs and preserves favorable existing financing.\n`;
      
      const gapMonthlyIO = (gapAmount * (gapRate / 100)) / 12;
      text += `\nMONTHLY PAYMENTS:\n`;
      text += `Existing Loan Payment: $${existingPayment.toLocaleString()}\n`;
      text += `Gap Note Payment (I/O): $${gapMonthlyIO.toFixed(0)}\n`;
      text += `Total Monthly Debt: $${(existingPayment + gapMonthlyIO).toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt: $${(monthlyCashFlow - existingPayment - gapMonthlyIO).toFixed(0)}\n`;
      
    } else if (strategy === 'performance-based') {
      // 📊 Performance-Based Price Adjustment (WIN-WIN)
      const downPaymentAmount = purchasePrice * (downPayment / 100);
      const financed = performanceBasePrice - downPaymentAmount;
      
      text += `📊 PERFORMANCE-BASED PRICE ADJUSTMENT (WIN-WIN)\n\n`;
      text += `Base Purchase Price: $${performanceBasePrice.toLocaleString()}\n`;
      text += `Performance Bonus Payment: $${performanceBonusAmount.toLocaleString()}\n`;
      text += `Target NOI for Bonus: $${performanceTargetNOI.toLocaleString()}\n`;
      text += `Maximum Total Price: $${(performanceBasePrice + performanceBonusAmount).toLocaleString()}\n`;
      text += `Down Payment: ${downPayment}% on base price ($${downPaymentAmount.toLocaleString()})\n`;
      text += `Financed Amount: $${financed.toLocaleString()}\n`;
      text += `Interest Rate: ${fullSellerRate}%\n`;
      text += `Amortization: ${fullSellerAmort} years\n`;
      text += `Balloon Term: ${fullSellerBalloon} years\n\n`;
      text += `If property achieves Target NOI of $${performanceTargetNOI.toLocaleString()} within 24 months, seller receives bonus payment of $${performanceBonusAmount.toLocaleString()}. This aligns incentives—seller gets upside for accurate representation, buyer pays fair value only if performance delivers.\n`;
      
      const monthlyRate = (fullSellerRate / 100) / 12;
      const numPayments = fullSellerAmort * 12;
      const monthlyPayment = financed * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      text += `\nMONTHLY PAYMENTS:\n`;
      text += `Debt Service (on base price): $${monthlyPayment.toFixed(0)}\n`;
      text += `Current Cash Flow After Debt: $${(monthlyCashFlow - monthlyPayment).toFixed(0)}\n`;
      text += `Projected Cash Flow at Target NOI: $${((performanceTargetNOI / 12) - monthlyPayment).toFixed(0)}\n`;
      
    } else if (strategy === 'equity-participation') {
      // 💰 Seller Financing + Equity Participation (CREATIVE)
      const discountedPrice = purchasePrice * ((100 - equityParticipationPercent * 0.5) / 100); // Approximate discount
      const downPaymentAmount = discountedPrice * (downPayment / 100);
      const financed = discountedPrice - downPaymentAmount;
      
      text += `💰 SELLER FINANCING + EQUITY PARTICIPATION (CREATIVE)\n\n`;
      text += `Discounted Purchase Price: $${discountedPrice.toFixed(0)} (${(equityParticipationPercent * 0.5).toFixed(1)}% discount from full price)\n`;
      text += `Down Payment: ${downPayment}% ($${downPaymentAmount.toFixed(0)})\n`;
      text += `Financed Amount: $${financed.toFixed(0)}\n`;
      text += `Interest Rate: ${fullSellerRate}%\n`;
      text += `Amortization: ${fullSellerAmort} years\n`;
      text += `Balloon Term: ${fullSellerBalloon} years\n`;
      text += `Seller Profit Participation: ${equityParticipationPercent}% of net profits upon sale or refinance\n\n`;
      text += `In exchange for accepting a discounted price, seller retains ${equityParticipationPercent}% equity participation in future profits. This gives seller ongoing upside while reducing buyer's acquisition cost.\n`;
      
      const monthlyRate = (fullSellerRate / 100) / 12;
      const numPayments = fullSellerAmort * 12;
      const monthlyPayment = financed * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      text += `\nMONTHLY PAYMENTS:\n`;
      text += `Debt Service: $${monthlyPayment.toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt: $${(monthlyCashFlow - monthlyPayment).toFixed(0)}\n`;
      text += `\nEQUITY PARTICIPATION EXAMPLE:\n`;
      text += `If property sold for $${(purchasePrice * 1.5).toLocaleString()} in 5 years:\n`;
      text += `  - Gross Profit: $${((purchasePrice * 1.5) - discountedPrice).toFixed(0)}\n`;
      text += `  - Seller's ${equityParticipationPercent}% Share: $${(((purchasePrice * 1.5) - discountedPrice) * (equityParticipationPercent / 100)).toFixed(0)}\n`;
      
    } else if (strategy === 'deferred-down') {
      // 🏦 Hybrid: Bank Loan + Deferred Down Payment (BANKABLE)
      const bankLoan = purchasePrice * (bankLTV / 100);
      const totalDownNeeded = purchasePrice - bankLoan;
      const downNow = totalDownNeeded * (deferredDownPercent / 100);
      const downDeferred = totalDownNeeded - downNow;
      
      text += `🏦 HYBRID: BANK LOAN + DEFERRED DOWN PAYMENT (BANKABLE)\n\n`;
      text += `Bank Loan (1st Position): ${bankLTV}% LTV ($${bankLoan.toLocaleString()}) at ${bankRate}% interest, ${bankAmort}-year amortization\n`;
      text += `Total Down Payment Required: $${totalDownNeeded.toLocaleString()}\n`;
      text += `  - Down Payment at Closing: ${deferredDownPercent}% ($${downNow.toFixed(0)})\n`;
      text += `  - Deferred Down Payment: $${downDeferred.toFixed(0)} (due in Year ${deferredDownYears})\n`;
      text += `Deferred Amount Interest: ${sellerRate}% (accrues but not paid until Year ${deferredDownYears})\n\n`;
      text += `This bankable structure splits the down payment—buyer pays ${deferredDownPercent}% now to satisfy bank requirements, with remaining down payment deferred ${deferredDownYears} years to allow for value creation and cash flow stabilization.\n`;
      
      const bankMonthlyRate = (bankRate / 100) / 12;
      const bankNumPayments = bankAmort * 12;
      const bankMonthlyPayment = bankLoan * (bankMonthlyRate * Math.pow(1 + bankMonthlyRate, bankNumPayments)) / (Math.pow(1 + bankMonthlyRate, bankNumPayments) - 1);
      const deferredInterest = downDeferred * (sellerRate / 100) * deferredDownYears;
      const totalDeferredPayment = downDeferred + deferredInterest;
      
      text += `\nMONTHLY PAYMENTS:\n`;
      text += `Bank Payment: $${bankMonthlyPayment.toFixed(0)}\n`;
      text += `Deferred Payment: $0/month (due Year ${deferredDownYears})\n`;
      text += `Monthly Cash Flow After Debt: $${(monthlyCashFlow - bankMonthlyPayment).toFixed(0)}\n`;
      text += `\nDEFERRED PAYMENT DUE IN YEAR ${deferredDownYears}:\n`;
      text += `  - Principal: $${downDeferred.toFixed(0)}\n`;
      text += `  - Accrued Interest: $${deferredInterest.toFixed(0)}\n`;
      text += `  - Total Due: $${totalDeferredPayment.toFixed(0)}\n`;
      
    } else if (strategy === 'traditional-seller') {
      // 📝 Traditional Seller Financing (STANDARD)
      const downPaymentAmount = purchasePrice * (downPayment / 100);
      const financed = purchasePrice - downPaymentAmount;
      
      text += `📝 TRADITIONAL SELLER FINANCING (STANDARD)\n\n`;
      text += `Seller to carry 100% financing with the following terms:\n`;
      text += `Down Payment: ${downPayment}% ($${downPaymentAmount.toLocaleString()})\n`;
      text += `Financed Amount: $${financed.toLocaleString()}\n`;
      text += `Interest Rate: ${fullSellerRate}%\n`;
      text += `Amortization: ${fullSellerAmort} years\n`;
      text += `Interest-Only Period: ${fullSellerIO} months\n`;
      text += `Balloon Term: ${fullSellerBalloon} years\n\n`;
      text += `Standard seller financing structure with typical terms. Seller receives consistent income stream with interest, buyer avoids bank qualification requirements and closing costs.\n`;
      
      const monthlyIO = (financed * (fullSellerRate / 100)) / 12;
      const monthlyRate = (fullSellerRate / 100) / 12;
      const numPayments = fullSellerAmort * 12;
      const monthlyAmort = financed * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      text += `\nMONTHLY PAYMENTS:\n`;
      text += `Interest-Only Payment (first ${fullSellerIO} months): $${monthlyIO.toFixed(0)}\n`;
      text += `Amortized Payment (after I/O period): $${monthlyAmort.toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt (I/O period): $${(monthlyCashFlow - monthlyIO).toFixed(0)}\n`;
      text += `Monthly Cash Flow After Debt (amortized): $${(monthlyCashFlow - monthlyAmort).toFixed(0)}\n`;
      
    } else if (strategy === 'cash-offer') {
      // 💵 Cash Offer (SIMPLE)
      const discountAmount = purchasePrice * (cashDiscountPercent / 100);
      const netPrice = purchasePrice - discountAmount;
      
      text += `💵 CASH OFFER (SIMPLE)\n\n`;
      text += `List Price: $${purchasePrice.toLocaleString()}\n`;
      text += `Cash Discount: ${cashDiscountPercent}% ($${discountAmount.toFixed(0)})\n`;
      text += `Net Cash Purchase Price: $${netPrice.toFixed(0)}\n`;
      text += `All Cash - No Financing Contingencies\n`;
      text += `Fast Closing: ${closingTimeline} days\n\n`;
      text += `Simple all-cash transaction with ${cashDiscountPercent}% discount for quick, clean close. No appraisals, no loan contingencies, no delays. Seller receives net proceeds in ${closingTimeline} days.\n`;
      
      text += `\nCASH FLOW:\n`;
      text += `Monthly NOI: $${monthlyCashFlow}\n`;
      text += `No Debt Service\n`;
      text += `Full Monthly Cash Flow: $${monthlyCashFlow}\n`;
      text += `Cash-on-Cash Return: ${((currentNOI / netPrice) * 100).toFixed(2)}%\n`;
      text += `Cap Rate on Net Price: ${((currentNOI / netPrice) * 100).toFixed(2)}%\n`;
    }

    text += `\n\nCONDITIONS:\n`;
    text += `- Subject to financing approval (if applicable)\n`;
    text += `- Subject to satisfactory inspection\n`;
    text += `- Clear title delivery\n`;
    text += `- Delivery of rent roll and trailing 12-month financials\n\n`;
    text += `This LOI is non-binding and subject to final purchase agreement.\n`;

    return text;
  };

  const canProceed = () => {
    if (step === 1) return purchasePrice > 0 && units > 0;
    if (step === 2) return strategy !== '';
    if (step === 3) return true;
    return true;
  };

  const submitLOI = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to submit an LOI');
        return;
      }

      const loiText = generateLOI();

      console.log('Submitting LOI with data:', {
        property_id: propertyId,
        buyer_id: user.id,
        seller_id: sellerId,
        purchase_price: purchasePrice,
        units: units,
        current_noi: currentNOI,
        closing_timeline: closingTimeline,
        dd_period: ddPeriod,
        earnest_money: earnestMoney,
        earnest_type: earnestType,
        strategy: strategy,
        loi_text: loiText,
        status: 'pending'
      });

      const { data, error } = await supabase
        .from('offers')
        .insert({
          property_id: propertyId,
          buyer_id: user.id,
          seller_id: sellerId,
          purchase_price: purchasePrice,
          units: units,
          current_noi: currentNOI,
          closing_timeline: closingTimeline,
          dd_period: ddPeriod,
          earnest_money: earnestMoney,
          earnest_type: earnestType,
          strategy: strategy,
          loi_text: loiText,
          status: 'pending'
        })
        .select();

      console.log('Insert result:', { data, error });

      if (error) throw error;

      alert('LOI submitted successfully! The seller will review your offer.');
      if (onClose) onClose();
    } catch (error) {
      console.error('Error submitting LOI:', error);
      alert('Failed to submit LOI: ' + error.message);
    }
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    display: 'block'
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  };

  const strategyCardStyle = (selected) => ({
    padding: '16px',
    border: selected ? '2px solid #000' : '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '12px',
    background: selected ? '#f0f0f0' : '#fff'
  });

  return (
    <div style={cardStyle}>
      <h3 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: '700' }}>LOI Builder</h3>
      
      {/* Stepper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: step >= s ? '#000' : '#ddd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontWeight: '700'
            }}>
              {s}
            </div>
            <div style={{ fontSize: '12px', color: step >= s ? '#000' : '#999' }}>
              {s === 1 ? 'Snapshot' : s === 2 ? 'Strategy' : s === 3 ? 'Terms' : 'Summary'}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Deal Snapshot */}
      {step === 1 && (
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Deal Snapshot</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Purchase Price</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>${purchasePrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="25000000"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Number of Units</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{units}</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Current NOI (Annual)</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>${currentNOI.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000000"
                step="5000"
                value={currentNOI}
                onChange={(e) => setCurrentNOI(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Closing Timeline</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{closingTimeline} days</span>
              </div>
              <input
                type="range"
                min="7"
                max="180"
                step="1"
                value={closingTimeline}
                onChange={(e) => setClosingTimeline(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Due Diligence Period</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>{ddPeriod} days</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={ddPeriod}
                onChange={(e) => setDdPeriod(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Earnest Money</span>
                <span style={{ fontSize: '14px', fontWeight: '700' }}>${earnestMoney.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={earnestMoney}
                onChange={(e) => setEarnestMoney(Number(e.target.value))}
                style={{ width: '100%', height: '6px', borderRadius: '3px', outline: 'none', WebkitAppearance: 'none', appearance: 'none', background: '#ddd', cursor: 'pointer' }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Earnest Money Type</label>
              <select value={earnestType} onChange={(e) => setEarnestType(e.target.value)} style={inputStyle}>
                <option value="refundable">Refundable</option>
                <option value="hard-after-dd">Goes hard after DD</option>
                <option value="non-refundable">Non-refundable at acceptance</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Strategy Selection */}
      {step === 2 && (
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Financing Strategy</h4>
          {strategies.map(s => {
            const price = purchasePrice;
            const noi = currentNOI;
            const monthlyNOI = (noi / 12).toFixed(0);
            
            // Generate live examples for each strategy
            let example = s.description;
            
            if (s.id === 'seller-carry-2nd') {
              const bankLoan = price * 0.80;
              const sellerSecond = price * 0.20;
              example = `Get ${(bankLoan).toLocaleString()} bank loan. Seller carries ${sellerSecond.toLocaleString()} 2nd mortgage interest-only for 3 years, then balloon. You bring $0 down.`;
            } else if (s.id === 'payment-delay') {
              example = `No payments for 6 months while you stabilize occupancy and increase rents. Perfect for properties at 60-70% occupancy.`;
            } else if (s.id === 'master-lease') {
              const leasePayment = Math.round(noi / 12 * 0.85);
              example = `Lease for covering seller's debt with option to buy within 3 years. 50% of lease payments credit toward purchase. Monthly: $${leasePayment.toLocaleString()}`;
            } else if (s.id === 'subject-to') {
              const assumedLoan = Math.round(price * 0.65);
              const gap = price - assumedLoan;
              example = `Take over existing loan subject-to. Seller carries equity gap at 5% interest-only for 5 years. Close with $0 down. Assumed: $${assumedLoan.toLocaleString()}, Gap: $${gap.toLocaleString()}`;
            } else if (s.id === 'performance-based') {
              const basePrice = Math.round(price * 0.85);
              const bonus = Math.round(price * 0.15);
              const targetNOI = Math.round(noi * 1.25);
              example = `Base price if NOI stays flat: $${basePrice.toLocaleString()}. Seller gets additional $${bonus.toLocaleString()} if you increase NOI to $${targetNOI.toLocaleString()}. Seller gets upside, you prove performance first.`;
            } else if (s.id === 'equity-participation') {
              const discounted = Math.round(price * 0.90);
              example = `Purchase at $${discounted.toLocaleString()} (10% discount). Seller gets 10% of profits when you refinance or sell. Lower entry price.`;
            } else if (s.id === 'deferred-down') {
              const bankLoan = price * 0.75;
              const downNow = Math.round(price * 0.10);
              const downDeferred = Math.round(price * 0.15);
              example = `Get ${bankLoan.toLocaleString()} bank financing. Pay $${downNow.toLocaleString()} down now, defer remaining $${downDeferred.toLocaleString()} as seller note payable in Year 3 from refi proceeds.`;
            } else if (s.id === 'traditional-seller') {
              const down = Math.round(price * 0.20);
              example = `Purchase with $${down.toLocaleString()} down (20-25%). Seller carries note at 5-7% interest over 20-30 years. No bank approval needed.`;
            } else if (s.id === 'cash-offer') {
              const discount = Math.round(price * 0.10);
              const netPrice = price - discount;
              example = `All-cash purchase at $${netPrice.toLocaleString()} (10% discount = $${discount.toLocaleString()} savings). Close in ${closingTimeline} days, no financing contingency.`;
            }

            return (
              <div key={s.id} onClick={() => setStrategy(s.id)} style={strategyCardStyle(strategy === s.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{s.label}</div>
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    background: s.badge === 'CREATIVE' ? '#ff9800' : s.badge === 'VALUE-ADD' ? '#4caf50' : s.badge === 'LOW RISK' ? '#2196f3' : s.badge === 'WIN-WIN' ? '#9c27b0' : s.badge === 'BANKABLE' ? '#00bcd4' : s.badge === 'STANDARD' ? '#607d8b' : '#000',
                    color: '#fff'
                  }}>
                    {s.badge}
                  </div>
                </div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{example}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Step 3: Terms */}
      {step === 3 && (
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>Terms & Structure</h4>
          
          {strategy === 'bank-seller' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Bank Loan</div>
              <div><label style={labelStyle}>Bank LTV (%)</label><input type="number" value={bankLTV} onChange={(e) => setBankLTV(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Bank Interest Rate (%)</label><input type="number" step="0.1" value={bankRate} onChange={(e) => setBankRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={bankAmort} onChange={(e) => setBankAmort(Number(e.target.value))} style={inputStyle} /></div>
              
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Seller Carry Second</div>
              <div><label style={labelStyle}>Seller Carry (%)</label><input type="number" value={sellerCarryAmount} onChange={(e) => setSellerCarryAmount(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={sellerRate} onChange={(e) => setSellerRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest-Only (months)</label><input type="number" value={sellerIO} onChange={(e) => setSellerIO(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={sellerAmort} onChange={(e) => setSellerAmort(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Balloon Term (years)</label><input type="number" value={sellerBalloon} onChange={(e) => setSellerBalloon(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Buyer Cash (%)</label><input type="number" value={buyerCash} onChange={(e) => setBuyerCash(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Partner Equity?</label><input type="checkbox" checked={hasPartner} onChange={(e) => setHasPartner(e.target.checked)} /></div>
              {hasPartner && <div><label style={labelStyle}>Partner %</label><input type="number" value={partnerEquity} onChange={(e) => setPartnerEquity(Number(e.target.value))} style={inputStyle} /></div>}
            </div>
          )}

          {strategy === 'full-seller' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Down Payment (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={fullSellerRate} onChange={(e) => setFullSellerRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={fullSellerAmort} onChange={(e) => setFullSellerAmort(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest-Only (months)</label><input type="number" value={fullSellerIO} onChange={(e) => setFullSellerIO(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Balloon Term (years)</label><input type="number" value={fullSellerBalloon} onChange={(e) => setFullSellerBalloon(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'partner-equity' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Down Payment % (Partner)</label><input type="number" value={partnerDownPercent} onChange={(e) => setPartnerDownPercent(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Buyer Contribution (%)</label><input type="number" value={buyerContribution} onChange={(e) => setBuyerContribution(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Partner Equity Share (%)</label><input type="number" value={partnerShare} onChange={(e) => setPartnerShare(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Preferred Return (%)</label><input type="number" step="0.1" value={preferredReturn} onChange={(e) => setPreferredReturn(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Buyout Trigger</label>
                <select value={buyoutTrigger} onChange={(e) => setBuyoutTrigger(e.target.value)} style={inputStyle}>
                  <option value="refi">On Refi</option>
                  <option value="sale">On Sale</option>
                  <option value="years">After X Years</option>
                </select>
              </div>
              <div><label style={labelStyle}>Buyout Method</label>
                <select value={buyoutMethod} onChange={(e) => setBuyoutMethod(e.target.value)} style={inputStyle}>
                  <option value="appraisal">New Appraisal</option>
                  <option value="cap-rate">Cap Rate on NOI</option>
                </select>
              </div>
            </div>
          )}

          {strategy === 'assumable' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>Existing Loan</div>
              <div><label style={labelStyle}>Balance</label><input type="number" value={existingBalance} onChange={(e) => setExistingBalance(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Rate (%)</label><input type="number" step="0.1" value={existingRate} onChange={(e) => setExistingRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Payment (monthly)</label><input type="number" value={existingPayment} onChange={(e) => setExistingPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Remaining Term (years)</label><input type="number" value={existingTerm} onChange={(e) => setExistingTerm(Number(e.target.value))} style={inputStyle} /></div>
              
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Gap Financing</div>
              <div><label style={labelStyle}>Gap Amount</label><input type="number" value={gapAmount} onChange={(e) => setGapAmount(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Rate (%)</label><input type="number" step="0.1" value={gapRate} onChange={(e) => setGapRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest-Only (months)</label><input type="number" value={gapIO} onChange={(e) => setGapIO(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Balloon (years)</label><input type="number" value={gapBalloon} onChange={(e) => setGapBalloon(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'master-lease' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Monthly Lease Payment</label><input type="number" value={leasePayment} onChange={(e) => setLeasePayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Lease Term (years)</label><input type="number" value={leaseTerm} onChange={(e) => setLeaseTerm(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Option Price</label><input type="number" value={optionPrice} onChange={(e) => setOptionPrice(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Option Term (years)</label><input type="number" value={optionTerm} onChange={(e) => setOptionTerm(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Option Credit?</label><input type="checkbox" checked={optionCredit} onChange={(e) => setOptionCredit(e.target.checked)} /></div>
              {optionCredit && <div><label style={labelStyle}>Credit Amount (%)</label><input type="number" value={creditAmount} onChange={(e) => setCreditAmount(Number(e.target.value))} style={inputStyle} /></div>}
            </div>
          )}

          {strategy === 'seller-carry-2nd' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Bank Loan (80% LTV)</div>
              <div><label style={labelStyle}>Bank Interest Rate (%)</label><input type="number" step="0.1" value={bankRate} onChange={(e) => setBankRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={bankAmort} onChange={(e) => setBankAmort(Number(e.target.value))} style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Seller 2nd Mortgage (20%)</div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={sellerRate} onChange={(e) => setSellerRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest-Only Period (years)</label><input type="number" value={sellerBalloon} onChange={(e) => setSellerBalloon(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'payment-delay' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Payment Delay Period (months)</label><input type="number" value={paymentDelayMonths} onChange={(e) => setPaymentDelayMonths(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Down Payment (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={fullSellerRate} onChange={(e) => setFullSellerRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={fullSellerAmort} onChange={(e) => setFullSellerAmort(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'subject-to' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '8px' }}>Existing Loan (Subject-To)</div>
              <div><label style={labelStyle}>Existing Loan Balance</label><input type="number" value={existingBalance} onChange={(e) => setExistingBalance(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Existing Rate (%)</label><input type="number" step="0.1" value={existingRate} onChange={(e) => setExistingRate(Number(e.target.value))} style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1', fontSize: '16px', fontWeight: '700', marginTop: '16px' }}>Seller Note for Gap</div>
              <div><label style={labelStyle}>Gap Amount</label><input type="number" value={gapAmount} onChange={(e) => setGapAmount(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={gapRate} onChange={(e) => setGapRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest-Only Period (years)</label><input type="number" value={gapBalloon} onChange={(e) => setGapBalloon(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'performance-based' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Base Purchase Price</label><input type="number" value={performanceBasePrice} onChange={(e) => setPerformanceBasePrice(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Target NOI Increase</label><input type="number" value={performanceTargetNOI} onChange={(e) => setPerformanceTargetNOI(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Bonus Payment if Target Hit</label><input type="number" value={performanceBonusAmount} onChange={(e) => setPerformanceBonusAmount(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Down Payment (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'equity-participation' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Purchase Price (Discounted)</label><input type="number" value={performanceBasePrice} onChange={(e) => setPerformanceBasePrice(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Down Payment (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Seller Profit Share (%)</label><input type="number" value={equityParticipationPercent} onChange={(e) => setEquityParticipationPercent(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={fullSellerRate} onChange={(e) => setFullSellerRate(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'deferred-down' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Bank LTV (%)</label><input type="number" value={bankLTV} onChange={(e) => setBankLTV(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Down Payment Now (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Deferred Down Payment (%)</label><input type="number" value={deferredDownPercent} onChange={(e) => setDeferredDownPercent(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Deferred Payment Due (years)</label><input type="number" value={deferredDownYears} onChange={(e) => setDeferredDownYears(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'traditional-seller' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Down Payment (%)</label><input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Interest Rate (%)</label><input type="number" step="0.1" value={fullSellerRate} onChange={(e) => setFullSellerRate(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Amortization (years)</label><input type="number" value={fullSellerAmort} onChange={(e) => setFullSellerAmort(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}

          {strategy === 'cash-offer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div><label style={labelStyle}>Discount from Asking (%)</label><input type="number" value={cashDiscountPercent} onChange={(e) => setCashDiscountPercent(Number(e.target.value))} style={inputStyle} /></div>
              <div><label style={labelStyle}>Closing Timeline (days)</label><input type="number" value={closingTimeline} onChange={(e) => setClosingTimeline(Number(e.target.value))} style={inputStyle} /></div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div>
          <h4 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>LOI Summary</h4>
          <textarea
            readOnly
            value={generateLOI()}
            style={{
              width: '100%',
              height: '400px',
              padding: '16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(generateLOI());
              alert('LOI copied to clipboard!');
            }}
            style={{
              ...buttonStyle,
              background: '#4caf50',
              color: '#fff',
              marginTop: '16px'
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          style={{
            ...buttonStyle,
            background: step === 1 ? '#ddd' : '#fff',
            color: step === 1 ? '#999' : '#000',
            border: '1px solid #ddd'
          }}
        >
          Back
        </button>
        <button
          onClick={() => step === 4 ? submitLOI() : setStep(Math.min(4, step + 1))}
          disabled={!canProceed()}
          style={{
            ...buttonStyle,
            background: canProceed() ? '#000' : '#ddd',
            color: '#fff'
          }}
        >
          {step === 4 ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}
