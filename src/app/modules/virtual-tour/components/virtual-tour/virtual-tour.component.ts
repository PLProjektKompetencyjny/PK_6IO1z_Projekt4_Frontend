import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { appName, assets, baseAssetsPath, enableDamping, maxRooms, maxZoom, minZoom, rotateSpeed, startRoomNo, startZoom } from './virtual-tour.config';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

@Component({
  selector: 'tn-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrl: './virtual-tour.component.scss'
})
export class VirtualTourComponent implements AfterViewInit {

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;

  protected readonly appName = appName;
  protected readonly assets = assets;
  currentRoomNo: number = startRoomNo;
  currentZoom: number = startZoom;
  generatingScene: boolean = true;

  renderer = new THREE.WebGLRenderer();
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
  mesh: THREE.Mesh = new THREE.Mesh();
  geometry: THREE.SphereGeometry = new THREE.SphereGeometry(100, 400, 1000).scale(-1, 1, 1);
  controls: OrbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  loader: THREE.TextureLoader = new THREE.TextureLoader();

  constructor(private readonly renderer2: Renderer2) {
    this.camera.position.z = 1;
    this.controls.rotateSpeed *= -rotateSpeed;
    this.controls.enableDamping = enableDamping;

    this.moveToRoom(startRoomNo);
  }

  ngAfterViewInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer2.appendChild(this.container.nativeElement, this.renderer.domElement);
    this.animate();
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel({ deltaY }: WheelEvent): void {
    const newZoomValue = this.currentZoom + -deltaY / 5000;
    if (newZoomValue >= minZoom && newZoomValue <= maxZoom) {
      this.currentZoom = newZoomValue;
    }
  }

  moveToRoom(roomNo: number): void {
    this.generatingScene = true;
    this.scene.remove(this.mesh);

    if (roomNo === 0) {
      roomNo = maxRooms;
    }

    if (roomNo > maxRooms) {
      roomNo = 0;
    }

    this.currentRoomNo = roomNo;
    setTimeout(() => {
      this.loader.load(`${baseAssetsPath}/${roomNo}.jpg`, (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(this.geometry, material);
        this.scene.add(this.mesh);
      });

      this.generatingScene = false;
    }, 400);
  }

  animate() {
    window.requestAnimationFrame(() => this.animate());

    this.controls.update();
    this.camera.zoom = this.currentZoom;
    this.camera.updateProjectionMatrix();

    this.renderer.render(this.scene, this.camera);
  }
}
