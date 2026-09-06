<?php
/**
 * Template Name: Corporate & B2B Quotation Request
 *
 * @package Jijau_Computers
 */

get_header();

$whatsapp = get_theme_mod('jijau_whatsapp', '918805607908');
?>

<main class="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
    <div class="text-center space-y-2 mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold uppercase tracking-wider">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Corporate B2B & Bulk Inquiries</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Request Official Commercial Quotation
        </h1>
        <p class="text-xs sm:text-sm text-slate-600">
            For IT companies, schools, universities, cyber cafes, and office setups requiring GST invoicing.
        </p>
    </div>

    <form class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="font-bold text-slate-700 block mb-1">Contact Name *</label>
                <input type="text" required placeholder="e.g. Anand Kulkarni" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
            </div>
            <div>
                <label class="font-bold text-slate-700 block mb-1">Company / Institution Name</label>
                <input type="text" placeholder="e.g. Infotech Solutions" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                <input type="tel" required placeholder="10-digit mobile" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
            </div>
            <div>
                <label class="font-bold text-slate-700 block mb-1">Official Email</label>
                <input type="email" placeholder="purchase@company.com" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600" />
            </div>
        </div>

        <div>
            <label class="font-bold text-slate-700 block mb-1">Required Items / Bill of Materials *</label>
            <textarea rows="4" required placeholder="List the quantities, required laptops, processor models, monitors, CCTV cameras or custom PC specs..." class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl outline-none focus:border-blue-600"></textarea>
        </div>

        <div class="pt-2">
            <a
                href="https://wa.me/<?php echo esc_attr($whatsapp); ?>?text=<?php echo urlencode('*Corporate B2B Quotation Request*\nHi Jijau Computers team, I would like to request an official GST quotation for our office setup.'); ?>"
                target="_blank"
                class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
                <i data-lucide="message-square" class="w-4 h-4"></i>
                <span>Send Quotation Request via WhatsApp</span>
            </a>
        </div>
    </form>
</main>

<?php
get_footer();
