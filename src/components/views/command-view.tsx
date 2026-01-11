import { GlobalHeader } from '@/components/dashboard/global-header';
import { DigitalTwin } from '@/components/dashboard/digital-twin';
import { ThermodynamicsPanel } from '@/components/dashboard/thermodynamics-panel';
import { BiometricsPanel } from '@/components/dashboard/biometrics-panel';
import { SystemLog } from '@/components/dashboard/system-log';

export function CommandView() {
  return (
    <div className="h-full flex flex-col gap-4">
      <GlobalHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-grow min-h-0">
        <div className="lg:col-span-3 min-h-[50vh] lg:min-h-0">
          <ThermodynamicsPanel />
        </div>
        <div className="lg:col-span-6 min-h-[50vh] lg:min-h-0">
          <DigitalTwin />
        </div>
        <div className="lg:col-span-3 min-h-[50vh] lg:min-h-0">
          <BiometricsPanel />
        </div>
      </div>
      <div className="h-48 xl:h-56">
        <SystemLog />
      </div>
    </div>
  );
}
