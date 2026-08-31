<?php
/**
 * Main Template File for Jijau Computers WordPress Theme
 *
 * @package Jijau_Computers
 */

get_header();
?>

<main class="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
    <?php if (have_posts()) : ?>
        <div class="space-y-6">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4'); ?>>
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="rounded-2xl overflow-hidden mb-4">
                            <?php the_post_thumbnail('large', array('class' => 'w-full max-h-96 object-cover')); ?>
                        </div>
                    <?php endif; ?>
                    <h1 class="text-2xl font-black text-slate-900">
                        <a href="<?php the_permalink(); ?>" class="hover:text-blue-600 transition-colors"><?php the_title(); ?></a>
                    </h1>
                    <div class="text-sm text-slate-700 leading-relaxed">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
    <?php else : ?>
        <div class="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto my-12 space-y-3">
            <h3 class="text-lg font-bold text-slate-800">Welcome to Jijau Computers</h3>
            <p class="text-xs text-slate-500">Explore our hardware catalog or visit the Devices Hub to browse Laptops, Mobiles, Printers, and CCTV cameras.</p>
            <a href="<?php echo esc_url(home_url('/devices')); ?>" class="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow hover:bg-blue-500">
                Open Devices Hub
            </a>
        </div>
    <?php endif; ?>
</main>

<?php
get_footer();
