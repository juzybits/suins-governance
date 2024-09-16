import { SUI_TLD } from "@/constants/common";

export const DISPLAY_NAME_LENGTH = 20;

export const pluralize = (number: number | string, noun: string) => {
  if (isNaN(Number(number))) {
    return noun;
  }
  if (["", 0, 1, "0", "1"].some((single) => number === single)) {
    return noun;
  }
  return `${noun}s`;
};

export const extractPackageAddressFromObjectType = (objectType: string) =>
  objectType.split("::")[0];

export const constructDomainName = (name: string, tld: string) =>
  `${name}.${tld}`;

export const delay = (timeToWaitMs: number) =>
  new Promise((resolve) => setTimeout(resolve, timeToWaitMs));

export const removeTld = (name: string, tld = SUI_TLD) => {
  if (!name) return name;
  const tldPattern = new RegExp(`\\.${tld}$`, "i");
  return name.replace(tldPattern, "");
};

// Support subdomain by reversing the name because it is stored in reverse order
export const parseContractLabel = (name: [] = []) => name.reverse().join(".");

const isTldName = (name: string) => name.split(".").length === 2;
const formatNameToNewStandard = (name?: string) =>
  name ? `@${removeTld(name.replace("@", ""))}` : "";

export const formatName = (
  name: string,
  options?: {
    lngLimit?: number;
    shortForm?: boolean;
    noTruncate?: boolean;
  },
): string => {
  // TODO: Enable subname when the feature is ready
  const enableSubname = true;
  const { lngLimit = 10, shortForm, noTruncate } = options ?? {};
  const removedTldName = removeTld(name);
  const splitNames = removedTldName.split(".").map((name) => {
    return noTruncate ? name : truncateFromMiddle(name, lngLimit);
  });
  const lastName = splitNames.pop();

  if (!lastName) {
    return "";
  }

  const formattedTldName = enableSubname
    ? formatNameToNewStandard(lastName)
    : `${lastName}.${SUI_TLD}`;

  if (isTldName(name)) {
    return formattedTldName;
  }
  if (shortForm) {
    return enableSubname
      ? `${splitNames[0]}${formattedTldName}`
      : `${splitNames[0]}.${formattedTldName}`;
  }

  if (enableSubname) {
    return `${splitNames.join(".")}${formattedTldName}`;
  }

  if (splitNames.length === 0) {
    return formattedTldName;
  }
  return `${splitNames.join(".")}.${formattedTldName}`;
};

export const truncateFromMiddle = (
  fullStr = "",
  strLen: number,
  middleStr = "...",
) => {
  if (fullStr.length <= strLen) return fullStr;
  const frontChars = fullStr.substring(0, 3);
  const backChars = fullStr.substring(fullStr.length - 3);
  return frontChars + middleStr + backChars;
};
