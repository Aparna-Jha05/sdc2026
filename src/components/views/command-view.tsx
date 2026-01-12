import { GlobalHeader } from '@/components/dashboard/global-header';
import { ThermodynamicsPanel } from '@/components/dashboard/thermodynamics-panel';
import { BiometricsPanel } from '@/components/dashboard/biometrics-panel';
import { SystemLog } from '@/components/dashboard/system-log';
import { DashboardPanel } from '../dashboard/dashboard-panel';
import { DigitalTwinDiagram } from '../dashboard/digital-twin-diagram';

export function CommandView() {
  return (
    <div className="h-full w-full flex flex-col gap-2 sm:gap-4">
      <GlobalHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 flex-grow min-h-0">
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <ThermodynamicsPanel />
        </div>
        <div className="lg:col-span-6 flex flex-col min-h-0">
          <DashboardPanel delay={0.2} className="flex-grow flex flex-col">
            <h2 className="text-base sm:text-lg font-headline font-bold text-primary mb-2 sm:mb-4 tracking-wider shrink-0 text-center">HABITAT DIGITAL TWIN</h2>
            <div className="w-full flex-1 flex items-center justify-center min-h-0">
              <DigitalTwinDiagram />
            </div>
          </DashboardPanel>
        </div>
        <div className="lg:col-span-3 flex flex-col min-h-0">
          <BiometricsPanel />
        </div>
      </div>
      <div className="h-48 xl:h-56 shrink-0">
        <SystemLog />
      </div>
    </div>
  );
}
