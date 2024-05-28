import { Asset } from './virtua-tour.model';

export { appName } from '../../../../app.config';
export const rotateSpeed: number = 0.1;
export const enableDamping: boolean = true;
export const startZoom: number = 1;
export const maxZoom: number = 1.5;
export const minZoom: number = 0.5;
export const startRoomNo: number = 1;
export const maxRooms: number = 5;
export const baseAssetsPath: string = 'assets/imgs/360';
export const assets: Asset[] = [
  {
    src: `${baseAssetsPath}/1.jpg`,
    alt: 'Room 1',
    roomNo: 1,
  },
  {
    src: `${baseAssetsPath}/2.jpg`,
    alt: 'Room 2',
    roomNo: 2,
  },
  {
    src: `${baseAssetsPath}/3.jpg`,
    alt: 'Room 3',
    roomNo: 3,
  },
  {
    src: `${baseAssetsPath}/4.jpg`,
    alt: 'Room 4',
    roomNo: 4,
  },
  {
    src: `${baseAssetsPath}/5.jpg`,
    alt: 'Room 5',
    roomNo: 5,
  },
];