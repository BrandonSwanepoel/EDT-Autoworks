import { Component, signal, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(IonContent, { static: false }) ionContent?: IonContent;

  // Form signals
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  vehicle = signal<string>('');
  selectedService = signal<string>('Vehicle Servicing (Minor & Major)');
  issue = signal<string>('');
  submittedNotice = signal<string | null>(null);
  mobileMenuOpen = signal<boolean>(false);

  readonly serviceOptions = [
    'Vehicle Servicing (Minor & Major)',
    'Mechanical Repairs (Engine & Drivetrain)',
    'Diagnostics & Electrical Repairs',
    'Brakes, Steering & Suspension',
    'General Maintenance (Cooling & Belts)',
    'Performance Modifications & Upgrades',
    'Other / Custom Project'
  ];

  readonly servicesList = [
    {
      title: 'Vehicle Servicing',
      subtitle: 'Minor & Major Services',
      description: 'Comprehensive minor and major services carried out to exacting standards, including premium synthetic oils, filter changes, spark plugs, fluid inspections, and bumper-to-bumper vehicle safety evaluations.',
      icon: 'construct-outline',
      highlights: ['Minor & Major Servicing', 'High-Grade Synthetic Oils & Filters', 'Multi-Point Safety Checklist']
    },
    {
      title: 'Mechanical Repairs',
      subtitle: 'Engine, Clutch, Gearbox & Drivetrain',
      description: 'In-depth mechanical overhauls and driveline repairs: engine internal work, clutch kit replacements, gearbox maintenance, differential servicing, drive-shafts, and drivetrain troubleshooting.',
      icon: 'settings-outline',
      highlights: ['Engine Mechanical Overhauls', 'Clutch Kit Replacements', 'Gearbox & Drivetrain Care']
    },
    {
      title: 'Diagnostics & Electrical',
      subtitle: 'Engine Fault Finding & Electrical Repairs',
      description: 'Advanced computer diagnostics and live data scanning to pinpoint check engine lights, fault codes, rough running, sensor anomalies, and auto-electrical circuit repairs with zero guesswork.',
      icon: 'hardware-chip-outline',
      highlights: ['Engine Fault Finding & OBD Scans', 'Live Sensor Data Diagnostics', 'Auto-Electrical Wiring Repairs']
    },
    {
      title: 'Brakes, Steering & Suspension',
      subtitle: 'Brake, Steering & Suspension Repairs',
      description: 'Precision stopping power and responsive road handling. Brake disc and pad replacements, fluid bleeding, rack & pinion steering repairs, tie-rod ends, control arm bushings, coilovers, and shocks.',
      icon: 'car-sport-outline',
      highlights: ['Brake Discs, Pads & Calipers', 'Steering Repairs & Linkages', 'Suspension & Bushing Overhauls']
    },
    {
      title: 'General Maintenance',
      subtitle: 'Cooling Systems, Belts, Hoses & Fluids',
      description: 'Essential preventative care keeping your engine at optimal operating temperature and preventing unexpected breakdowns: radiators, water pumps, thermostats, drive belts, timing belts, and cooling hoses.',
      icon: 'shield-checkmark-outline',
      highlights: ['Cooling Systems & Radiators', 'Water Pumps & Thermostats', 'Belts, Hoses & Fluid Flushes']
    },
    {
      title: 'Performance Modifications',
      subtitle: 'Hardware Upgrades & Motorsport Prep',
      description: 'Bespoke performance upgrades and modifications for automotive enthusiasts: bolt-on turbo conversions, high-flow intercoolers, custom downpipes, performance intakes, uprated clutches, and spirited setup.',
      icon: 'speedometer-outline',
      highlights: ['Performance Bolt-Ons & Hardware', 'Turbo & Intercooler Upgrades', 'Intakes, Downpipes & Boost Setup']
    }
  ];

  updateField(field: string, event: any) {
    const value = event.target.value;
    switch(field) {
      case 'name': this.name.set(value); break;
      case 'email': this.email.set(value); break;
      case 'phone': this.phone.set(value); break;
      case 'vehicle': this.vehicle.set(value); break;
      case 'issue': this.issue.set(value); break;
    }
  }

  selectService(service: string) {
    const clean = service.toLowerCase();
    const matched = this.serviceOptions.find(opt => {
      const optClean = opt.toLowerCase();
      return optClean.includes(clean) || clean.includes(optClean.split(' (')[0]);
    });
    this.selectedService.set(matched || service);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  async scrollToSection(sectionId: string) {
    const wasMobileMenuOpen = this.mobileMenuOpen();
    this.closeMobileMenu();

    if (wasMobileMenuOpen) {
      // Allow mobile drawer to collapse so header height measurement is accurate
      await new Promise(resolve => setTimeout(resolve, 120));
    }

    const el = document.getElementById(sectionId);
    if (!el) return;

    if (this.ionContent) {
      try {
        const scrollEl = await this.ionContent.getScrollElement();
        const headerEl = document.querySelector('.site-header');
        const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 68;
        
        // 24px comfortable breathing room between sticky navbar and the section title
        const totalOffset = headerHeight + 24;

        const currentScroll = scrollEl.scrollTop;
        const targetRect = el.getBoundingClientRect();
        const scrollRect = scrollEl.getBoundingClientRect();

        const targetY = currentScroll + (targetRect.top - scrollRect.top) - totalOffset;
        await this.ionContent.scrollToPoint(0, Math.max(0, targetY), 500);
        return;
      } catch (err) {
        // Fallback below
      }
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private validateFields(): boolean {
    if (!this.name().trim() || !this.vehicle().trim() || !this.issue().trim()) {
      alert('Please provide your Name, Vehicle details, and a brief description of what you need.');
      return false;
    }
    return true;
  }

  private generateInquiryText(): string {
    return `Hi EDT Autoworks, I would like to inquire about a booking / quote:

*Name:* ${this.name().trim()}
*Phone/WhatsApp:* ${this.phone().trim() || 'Not specified'}
*Email:* ${this.email().trim() || 'Not specified'}

*Vehicle:* ${this.vehicle().trim()}
*Service Needed:* ${this.selectedService()}

*Details:*
${this.issue().trim()}`;
  }

  sendViaWhatsApp() {
    if (!this.validateFields()) return;
    const text = encodeURIComponent(this.generateInquiryText());
    this.submittedNotice.set('Opening WhatsApp with your details...');
    window.open(`https://wa.me/27646587141?text=${text}`, '_blank');
  }

  sendViaEmail() {
    if (!this.validateFields()) return;
    const recipient = 'Edtautoworks@gmail.com';
    const subject = encodeURIComponent(`Service Inquiry: ${this.selectedService()} - ${this.vehicle()} (${this.name()})`);
    const body = encodeURIComponent(this.generateInquiryText());
    this.submittedNotice.set('Opening your email client with your details...');
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  }

  clearNotice() {
    this.submittedNotice.set(null);
  }
}
