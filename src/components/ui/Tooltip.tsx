// import type { Placement } from '@floating-ui/react';
// import {
//     arrow,
//     autoUpdate,
//     flip,
//     FloatingPortal,
//     offset,
//     shift,
//     useDismiss,
//     useFloating,
//     useFocus,
//     useHover,
//     useInteractions,
//     useRole,
// } from '@floating-ui/react';
// import clsx from 'clsx';
// import { AnimatePresence, motion } from 'framer-motion';
// import type { CSSProperties, ReactNode } from 'react';
// import { useRef, useState } from 'react';

// const TOOLTIP_DELAY = 150;

// export interface TooltipProps {
//     tip: ReactNode;
//     children: ReactNode;
//     onOpen?: () => void;
//     placement?: Placement;
//     role?: 'button' | 'link';
//     className?: string;
// }

// export function Tooltip({ tip, children, onOpen, className, role = 'button', placement = 'top' }: TooltipProps) {
//     const [open, setOpen] = useState(false);
//     const arrowRef = useRef(null);

//     const {
//         x,
//         y,
//         refs,
//         strategy,
//         context,
//         middlewareData,
//         placement: finalPlacement,
//     } = useFloating({
//         placement,
//         open,
//         onOpenChange: (updatedIsOpen) => {
//             if (open !== updatedIsOpen && updatedIsOpen && onOpen) {
//                 onOpen();
//             }
//             setOpen(updatedIsOpen);
//         },
//         whileElementsMounted: autoUpdate,
//         middleware: [offset(5), flip(), shift(), arrow({ element: arrowRef, padding: 6 })],
//     });

//     const { getReferenceProps, getFloatingProps } = useInteractions([
//         useHover(context, { move: true, delay: TOOLTIP_DELAY }),
//         useFocus(context),
//         useRole(context, { role: 'tooltip' }),
//         useDismiss(context),
//     ]);

//     const animateProperty = finalPlacement.startsWith('top') || finalPlacement.startsWith('bottom') ? 'y' : 'x';

//     const animateValue =
//         finalPlacement.startsWith('bottom') || finalPlacement.startsWith('right')
//             ? 'calc(-50% - 15px)'
//             : 'calc(50% + 15px)';

//     const arrowStyle: CSSProperties = {
//         left: middlewareData.arrow?.x,
//         top: middlewareData.arrow?.y,
//         backgroundColor: '#383F47',
//     };

//     const staticSide = (
//         {
//             top: 'bottom',
//             right: 'left',
//             bottom: 'top',
//             left: 'right',
//         } as const
//     )[finalPlacement.split('-')[0]];

//     if (staticSide) {
//         arrowStyle[staticSide] = '-3px';
//     }

//     return (
//         <>
//             <div
//                 tabIndex={0}
//                 role={role}
//                 ref={refs.setReference}
//                 className={clsx('w-fit', className)}
//                 {...getReferenceProps()}
//             >
//                 {children}
//             </div>
//             <FloatingPortal>
//                 <AnimatePresence>
//                     {open ? (
//                         <motion.div
//                             ref={refs.setFloating}
//                             className='pointer-events-none left-0 top-0 z-50 text-subtitleSmall font-semibold text-white'
//                             initial={{
//                                 opacity: 0,
//                                 scale: 0,
//                                 [animateProperty]: animateValue,
//                             }}
//                             animate={{
//                                 opacity: 1,
//                                 scale: 1,
//                                 [animateProperty]: 0,
//                             }}
//                             exit={{
//                                 opacity: 0,
//                                 scale: 0,
//                                 [animateProperty]: animateValue,
//                             }}
//                             transition={{
//                                 duration: 0.3,
//                                 ease: 'anticipate',
//                             }}
//                             style={{
//                                 position: strategy,
//                                 top: y ?? 0,
//                                 left: x ?? 0,
//                                 width: 'max-content',
//                                 maxWidth: '200px',
//                             }}
//                             {...getFloatingProps()}
//                         >
//                             <div className='leading-1 leading-130 flex flex-col flex-nowrap gap-px rounded-md bg-gray-90 p-2'>
//                                 {tip}
//                             </div>
//                             <div
//                                 ref={arrowRef}
//                                 className='absolute z-[-1] h-[12px] w-[12px] rotate-45 transform bg-gray-100'
//                                 style={arrowStyle}
//                             />
//                         </motion.div>
//                     ) : null}
//                 </AnimatePresence>
//             </FloatingPortal>
//         </>
//     );
// }
