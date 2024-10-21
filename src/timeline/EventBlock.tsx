import XDate from 'xdate';
import React, {useCallback, useMemo} from 'react';
import {View, Text, TextStyle, TouchableOpacity, ViewStyle, StyleSheet} from 'react-native';

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
  car?: string;
  client?: string;
  description?: string;
  phone?: string;
  value?: string;
}

export interface PackedEvent extends Event {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EventBlockProps {
  index: number;
  event: PackedEvent;
  onPress: (eventIndex: number) => void;
  renderEvent?: (event: PackedEvent) => JSX.Element;
  format24h?: boolean;
  styles: {[key: string]: ViewStyle | TextStyle};
  testID?: string;
}

const TEXT_LINE_HEIGHT = 17;
const EVENT_DEFAULT_COLOR = '#add8e6';

const EventBlock = (props: EventBlockProps) => {
  const {index, event, renderEvent, onPress, format24h, styles} = props;

  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';
  const eventStyle = useMemo(() => {
    return {
      left: event.left,
      height: event.height,
      width: event.width,
      top: event.top,
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR
    };
  }, [event]);

  const _onPress = useCallback(() => {
    onPress(index);
  }, [index, onPress]);

  return (
    <TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (
        renderEvent(event)
      ) : (
        <View>
          <Text numberOfLines={1} style={defaultStyles.eventTitle}>
            {event.title || 'Event'} {event.client ? ` - ${event.client}` : ''}
          </Text>

          <View style={defaultStyles.row}>
            {event.car ? (
              <Text numberOfLines={1} style={defaultStyles.eventDetails}>
                {event.car}
              </Text>
            ) : null}

            {event.car && event.value ? (
              <Text style={defaultStyles.eventDetails}>
                {' - '}
              </Text>
            ) : null}

            {event.value ? (
              <Text numberOfLines={1} style={defaultStyles.eventDetails}>
                R$ {parseFloat(event.value).toFixed(2).replace('.', ',')}
              </Text>
            ) : null}
          </View>

          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={defaultStyles.eventSummary}>
              {event.summary || ' '}
            </Text>
          ) : null}

          {numberOfLines > 2 ? (
            <Text style={defaultStyles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: '#555',
  },
  eventSummary: {
    fontSize: 14,
    color: '#666',
  },
  eventTimes: {
    fontSize: 12,
    color: '#888',
  },
  event: {
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaced: {
    marginRight: 8, 
  }
});

export default EventBlock;
