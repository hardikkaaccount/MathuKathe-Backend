import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useMutation } from '@apollo/client';
import { GENERATE_SUMMARY_MUTATION } from '@/queries/chat';
import { Calendar, Loader2, Sparkles, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

type DateRange = 'today' | '3days' | 'week' | 'custom';

export function SummaryModal({ isOpen, onClose, groupId }: SummaryModalProps) {
    const [dateRange, setDateRange] = useState<DateRange>('today');
    const [summary, setSummary] = useState<string | null>(null);
    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");

    const [generateSummary, { loading }] = useMutation(GENERATE_SUMMARY_MUTATION);

    const handleGenerate = async () => {
        const now = new Date();
        let toDate = now.toISOString();
        let fromDate = new Date();

        switch (dateRange) {
            case 'today':
                fromDate.setHours(0, 0, 0, 0);
                break;
            case '3days':
                fromDate.setDate(now.getDate() - 3);
                break;
            case 'week':
                fromDate.setDate(now.getDate() - 7);
                break;
            case 'custom':
                if (!customFromDate || !customToDate) return;
                fromDate = new Date(customFromDate);
                toDate = new Date(customToDate).toISOString();
                break;
        }

        try {
            const { data } = await generateSummary({
                variables: {
                    group_id: groupId,
                    from_date: fromDate.toISOString(),
                    to_date: toDate
                }
            });
            if (data?.generate_summary?.summary) {
                setSummary(data.generate_summary.summary);
            }
        } catch (error) {
            console.error("Failed to generate summary:", error);
        }
    };

    const reset = () => {
        setSummary(null);
        setDateRange('today');
        setCustomFromDate("");
        setCustomToDate("");
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={reset}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-start mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-amber-500" />
                                        Catch Up with AI Summary
                                    </Dialog.Title>
                                    <button onClick={reset} className="text-slate-400 hover:text-slate-500">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {!summary ? (
                                    <>
                                        <div className="mt-2">
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                Choose a time range to summarize the conversation. Mathu AI will read the messages and give you the highlights.
                                            </p>
                                        </div>

                                        <div className="mt-6 flex flex-col gap-3">
                                            <button
                                                onClick={() => setDateRange('today')}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                                    dateRange === 'today'
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500"
                                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Calendar className="w-5 h-5 text-indigo-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 dark:text-white">Since Today Morning</p>
                                                    <p className="text-xs text-slate-500">Best for daily catch-up</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setDateRange('3days')}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                                    dateRange === '3days'
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500"
                                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Calendar className="w-5 h-5 text-indigo-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 dark:text-white">Past 3 Days</p>
                                                    <p className="text-xs text-slate-500">Good for checking missed discussions</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setDateRange('week')}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                                    dateRange === 'week'
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500"
                                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Calendar className="w-5 h-5 text-indigo-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 dark:text-white">Past Week</p>
                                                    <p className="text-xs text-slate-500">Weekly digest</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => setDateRange('custom')}
                                                className={cn(
                                                    "flex items-center gap-3 p-4 rounded-xl border transition-all text-left",
                                                    dateRange === 'custom'
                                                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500"
                                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                                )}
                                            >
                                                <Calendar className="w-5 h-5 text-indigo-500" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-900 dark:text-white">Custom Range</p>
                                                    <p className="text-xs text-slate-500">Pick specific dates</p>
                                                </div>
                                            </button>

                                            {dateRange === 'custom' && (
                                                <div className="grid grid-cols-2 gap-4 mt-2 pl-4 animate-in fade-in slide-in-from-top-2">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-slate-500">From</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={customFromDate}
                                                            onChange={(e) => setCustomFromDate(e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-slate-500">To</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={customToDate}
                                                            onChange={(e) => setCustomToDate(e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8">
                                            <button
                                                onClick={handleGenerate}
                                                disabled={loading || (dateRange === 'custom' && (!customFromDate || !customToDate))}
                                                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Generating Summary...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4 text-amber-200" />
                                                        Generate Summary
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mt-2 animate-in fade-in zoom-in-95 duration-300">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 max-h-[60vh] overflow-y-auto">
                                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                                {summary}
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                onClick={reset}
                                                className="inline-flex justify-center rounded-lg border border-transparent bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
