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
  selectedService = signal<string>('General Service & Maintenance');
  issue = signal<string>('');
  submittedNotice = signal<string | null>(null);
  mobileMenuOpen = signal<boolean>(false);

  readonly serviceOptions = [
    'General Service & Maintenance',
    'Diagnostics & Warning Lights',
    'Brakes & Suspension',
    'Performance Parts & Turbo Upgrades',
    'Engine Mechanical Repairs',
    'Clutch & Drivetrain',
    'Other / Custom Project'
  ];

  readonly servicesList = [
    {
      title: 'Logbook Servicing & Maintenance',
      subtitle: 'Routine Care & Preventative Checks',
      description: 'Major and minor servicing including high-grade synthetic oil changes, spark plugs, filters, fluid flushes, and comprehensive vehicle safety inspections.',
      icon: 'construct-outline',
      highlights: ['Engine Oil & Filters', 'Brake Fluid & Coolant', 'Full Safety Checklist']
    },
    {
      title: 'Computer Diagnostics & Fault Finding',
      subtitle: 'Accurate Problem Isolation',
      description: 'In-depth OBD2 computer scans, live sensor data analysis, check engine light diagnostics, and electrical troubleshooting to identify faults before replacing parts.',
      icon: 'hardware-chip-outline',
      highlights: ['Check Engine Lights', 'Sensor Live Data', 'Electrical Troubleshooting']
    },
    {
      title: 'Brakes & Suspension Overhauls',
      subtitle: 'Stopping Power & Handling',
      description: 'Disc and pad replacements, brake fluid bleeding, coilover installations, lowering springs, control arms, and bush replacements for daily driving or spirited performance.',
      icon: 'car-sport-outline',
      highlights: ['Pads & Rotors', 'Coilovers & Springs', 'Bushings & Ball Joints']
    },
    {
      title: 'Performance Bolt-Ons & Turbo Upgrades',
      subtitle: 'Bespoke Upgrades For Enthusiasts',
      description: 'Installation of aftermarket bolt-on performance hardware: intercoolers, turbo conversions, downpipes, intake systems, blow-off valves, and custom plumbing.',
      icon: 'speedometer-outline',
      highlights: ['Turbo & Intercoolers', 'Intakes & Downpipes', 'Boost Hardware']
    },
    {
      title: 'Mechanical Repairs & Overhauls',
      subtitle: 'Reliable Engine & Drivetrain Repairs',
      description: 'Timing belt and timing chain replacements, cylinder head gaskets, cooling system refreshes (water pumps & thermostats), and clutch replacements.',
      icon: 'settings-outline',
      highlights: ['Timing Chains & Belts', 'Head Gaskets & Seals', 'Clutch Replacements']
    },
    {
      title: 'Pre-Purchase & Track Inspections',
      subtitle: 'Peace of Mind On Every Drive',
      description: 'Comprehensive mechanical pre-purchase health checks before you buy a vehicle, plus track-day nut-and-bolt safety inspections to ensure reliability under load.',
      icon: 'shield-checkmark-outline',
      highlights: ['Pre-Buy Inspection', 'Compression Testing', 'Fluid & Belt Checks']
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
    this.selectedService.set(service);
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
