import { OwlOptions } from 'ngx-owl-carousel-o';

export { appName } from '../../../../app.config';

export const owlOptions: OwlOptions = {
  items: 2,
  loop: true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  margin: 20,
  lazyLoad: true,
  slideTransition: 'ease-out',
  nav: true,
  navText: ['<i class="bi bi-chevron-left fs-4"></i>', '<i class="bi bi-chevron-right fs-4"></i>']
};