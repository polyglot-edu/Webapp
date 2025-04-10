export enum Platform {
  PolyGloT = 'PolyGloT',
  VirtualStudio = 'VirtualStudio',
  Papyrus = 'Papyrus',
  WebApp = 'WebApp',
  WorkAdventure = 'WorkAdventure',
}
export enum ZoneId {
  FreeZone = 'FreeZone',
  OutsideZone = 'OutsideZone',
  SilentZone = 'SilentZone',
  LearningPathSelectionZone = 'LearningPathSelectionZone',
  InstructionWebpageZone = 'InstructionWebpageZone',
  WebAppZone = 'WebAppZone',
  MeetingRoomZone = 'MeetingRoomZone',
  PolyGlotLearningZone = 'PolyGlotLearningZone',
  PolyGlotLearningPathCreationZone = 'PolyGlotLearningPathCreationZone',
  PapyrusWebZone = 'PapyrusWebZone',
  VirtualStudioZone = 'VirtualStudioZone',
}

export type AnalyticsActionBody = {
  timestamp: Date;
  userId: string;
  actionType: string;
  zoneId: ZoneId;
  platform: Platform;
  action: any;
};

export type GradeAction = AnalyticsActionBody & {
  action: {
    flow: string;
    grade: number;
  };
};
export type OpenCloseNodeAction = AnalyticsActionBody & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};

export type OpenLPInfoAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type CloseLPInfoAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type SelectRemoveLPAction = AnalyticsActionBody & {
  action: {
    flowId: string;
  };
};

export type OpenCloseTool = AnalyticsActionBody & {
  action: {
    flowId: string;
    nodeId: string;
    activity: string;
  };
};
