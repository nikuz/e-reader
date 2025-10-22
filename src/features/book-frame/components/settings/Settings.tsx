import { useState, useRef, useEffect } from 'react';
import {
    Dropdown,
    IconButton,
    List,
    ListItem,
    Accordion,
    type AccordionProps,
    AccordionSummary,
    type AccordionSummaryProps,
    accordionSummaryClasses,
    AccordionDetails,
    Typography,
} from 'src/design-system/components';
import { styled } from 'src/design-system/styles';
import { SettingsIcon, ArrowForwardIosSharpIcon } from 'src/design-system/icons';
import {
    FontSize,
    FontLineHeight,
    FontColor,
    FontOverrideBookFonts,
    FontFamily,
    FontWordSpacing,
    FontLetterSpacing,
    LayoutParagraphMargin,
    LayoutMargin,
} from 'src/features/settings/components';

export function BookFrameSettings() {
    const [expandedGroup, setExpandedGroup] = useState<'font' | 'layout'>('font');
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const marginSides = ['left', 'right', 'top', 'bottom'] as const;

    const groupChangeHandler = (group: 'font' | 'layout') => () => {
        setExpandedGroup(group);
    };

    const closeSettingsHandler = () => {
        if (expandedGroup === 'font') {
            return;
        }
        closeTimerRef.current = setTimeout(() => setExpandedGroup('font'), 300);
    };

    useEffect(() => {
        return () => clearTimeout(closeTimerRef.current);
    }, []);

    return (
        <Dropdown
            content={[
                <CustomAccordion
                    key="font"
                    expanded={expandedGroup === 'font'}
                    onChange={groupChangeHandler('font')}
                >
                    <CustomAccordionSummary>
                        <Typography component="span">Fonts</Typography>
                    </CustomAccordionSummary>
                    <AccordionDetails>
                        <List className="w-[50vw]">
                            <ListItem>
                                <FontSize />
                            </ListItem>
                            <ListItem>
                                <FontLineHeight />
                            </ListItem>
                            <ListItem>
                                <FontColor />
                            </ListItem>
                            <ListItem>
                                <FontOverrideBookFonts />
                            </ListItem>
                            <ListItem>
                                <FontFamily />
                            </ListItem>
                            <ListItem>
                                <FontWordSpacing />
                            </ListItem>
                            <ListItem>
                                <FontLetterSpacing />
                            </ListItem>
                        </List>
                    </AccordionDetails>
                </CustomAccordion>,
                <CustomAccordion
                    key="layout"
                    expanded={expandedGroup === 'layout'}
                    onChange={groupChangeHandler('layout')}
                >
                    <CustomAccordionSummary>
                        <Typography component="span">Layout</Typography>
                    </CustomAccordionSummary>
                    <AccordionDetails>
                        <List className="w-[50vw]">
                            <ListItem>
                                <LayoutParagraphMargin />
                            </ListItem>
                            {marginSides.map(side => (
                                <ListItem key={side}>
                                    <LayoutMargin side={side} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </CustomAccordion>
            ]}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={closeSettingsHandler}
        >
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ ml: 2 }}
            >
                <SettingsIcon />
            </IconButton>
        </Dropdown>
    );
}

const CustomAccordion = styled((props: AccordionProps) => (
    <Accordion
        disableGutters
        elevation={0}
        square
        slotProps={{ transition: { timeout: 150 } }}
        {...props}
    />
))(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}));

const CustomAccordionSummary = styled((props: AccordionSummaryProps) => (
    <AccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
        transform: 'rotate(90deg)',
    },
    [`& .${accordionSummaryClasses.content}`]: {
        marginLeft: theme.spacing(1),
    },
    ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255, 255, 255, .05)',
    }),
}));