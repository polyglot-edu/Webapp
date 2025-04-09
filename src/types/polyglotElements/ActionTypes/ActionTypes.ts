export enum Platform {
  PolyGloT,
  VirtualStudio,
  Papyrus,
  WebApp,
  WorkAdventure,
}

export enum ZoneId {
  FreeZone,
  OutsideZone,
  SilentZone,
  LearningPathSelectionZone,
  InstructionWebpageZone,
  WebAppZone,
  MeetingRoomZone,
  PolyGlotLearningZone,
  PolyGlotLearningPathCreationZone,
  PapyrusWebZone,
  VirtualStudioZone,
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
