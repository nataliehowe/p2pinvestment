<?php $__env->startSection('title','404'); ?>

<?php $__env->startSection('content'); ?>
    <section class="error-page wow fadeInUp mb-5 pb-5">
        <div class="container">
            <div class="row justify-content-between">
                <div class="col-md-12 text-center my-5">
                    <span class="golden-text opps d-block"><?php echo e(trans('Opps!')); ?></span>
                    <div class="sub_title golden-text mb-4 lead"><?php echo e(trans('The page you are looking for was not found.')); ?></div>
                    <a class="gold-btn" href="<?php echo e(url('/')); ?>" ><?php echo app('translator')->get('Back To Home'); ?></a>
                </div>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make($theme.'layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/claifmyn/pifi-group.biz/resources/views/themes/p2pinvestment/errors/404.blade.php ENDPATH**/ ?>