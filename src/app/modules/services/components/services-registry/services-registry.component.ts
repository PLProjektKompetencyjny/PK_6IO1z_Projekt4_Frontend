import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ServiceService } from '../../../../services/service/service.service';
import { ServiceMgmt } from '../../service.model';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'tn-services-registry',
  templateUrl: './services-registry.component.html',
  styleUrl: './services-registry.component.scss'
})
export class ServicesRegistryComponent implements OnInit {

  services: ServiceMgmt[] = [];
  readonly emptyService: ServiceMgmt = {
    id: 0,
    name: '',
    unit_price: 0,
  };

  constructor(
    private readonly servicesService: ServiceService,
    private readonly notificationsService: NotificationsService,
    private readonly authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getServices();
  }

  async getServices(): Promise<void> {
    try {
      this.services = await this.servicesService.getMgmt();
    } catch (e) {
      console.error(e);
    }
  }

  async save(): Promise<void> {
    if (this.validate() === false) {
      this.notificationsService.error('Error', 'Fill required data');
      return;
    }

    try {
      /**
       * The order is crucial. 
       * First we update then we add.
       */
      await this.update();
      await this.addNew();

      this.notificationsService.success('Success', 'Services saved successfully');

      await this.getServices();
    } catch (e) {
      console.error(e);
    }
  }

  addEmptyService(): void {
    this.services.push(this.emptyService);
  }

  validate(): boolean {
    if (this.services.some(s => !s.name || !s.unit_price)) {
      return false;
    }

    return true;
  }

  /**
   * Adds non existent services in DB
   */
  async addNew(): Promise<void> {
    const nonExistentServices = this.services.filter(s => !s.id);
    for (let service of nonExistentServices) {
      service = {
        ...service,
        last_modified_by: this.authService.session?.user_id ?? 0,
        last_modified_at: new Date(),
      }
      await this.servicesService.create(service);
    }
  }

  /**
   * Updates existing services in DB
   */
  async update(): Promise<void> {
    const existingServices = this.services.filter(s => s.id > 0);
    for (let service of existingServices) {
      service = {
        ...service,
        last_modified_by: this.authService.session?.user_id ?? 0,
        last_modified_at: new Date(),
      }
      await this.servicesService.update(service);
    }
  }

  async delete(index: number): Promise<void> {
    const { id } = this.services[index];
    try {
      if (id > 0) {
        await this.servicesService.delete(id);
      }

      this.services.splice(index, 1);

      this.notificationsService.success('Success', 'Service deleted successfully');
    } catch (e) {
      console.error(e);
    }
  }

}
